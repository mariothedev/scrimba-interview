// public/main.js
// ============================================================================
//  LESSON ENGINE — director (timing / audio / flow) + renderer (libs -> SVG)
//  Libs: GSAP (motion) · d3 (arc/axis/format) · elkjs (graph layout)
//        tsParticles (optional atmosphere) · SVG (all content, one plane)
//
//  Production guarantees:
//   • A malformed element / animation / scene never kills playback (isolated).
//   • Animation timing is resolved from the audio's word timestamps when
//     present, so generated lessons sync without hand-tuned seconds.
//   • Scenes are deterministic (seeded RNG) — reproducible & snapshot-testable.
//   • Real transport: play / pause / resume / replay, gapless audio preloading.
//   • Missing libs degrade per-feature instead of throwing.
// ============================================================================
const gsap = window.gsap;
const d3 = window.d3;
const tsParticles = window.tsParticles;
const ELK = window.ELK;
const elk = ELK ? new ELK() : null;

const root = document.getElementById("app");
const SVGNS = "http://www.w3.org/2000/svg";
const STAGE_W = 700;
const STAGE_H = 360;
const DEFAULT_BG = "#1d1747";
const BTN_PLAY = "\u25B6 Play";
const BTN_PAUSE = "\u2759\u2759 Pause";
const BTN_RESUME = "\u25B6 Resume";
const BTN_REPLAY = "\u21BB Replay";

if (!gsap) console.error("GSAP failed to load — the engine cannot animate.");

// ----------------------------------------------------------------------------
//  Utilities
// ----------------------------------------------------------------------------
// deterministic PRNG (mulberry32) so a scene renders identically every run
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// pausable wall clock: now() freezes between pause()/resume() so visuals and
// audio stay locked together across a pause.
function createClock() {
  let base = performance.now();
  let paused = false;
  let pausedAt = 0;
  return {
    now() { return ((paused ? pausedAt : performance.now()) - base) / 1000; },
    pause() { if (!paused) { paused = true; pausedAt = performance.now(); } },
    resume() { if (paused) { base += performance.now() - pausedAt; paused = false; } },
  };
}

// ----------------------------------------------------------------------------
//  Live registry — free-running tweens/particles, torn down on scene change.
//  Pause/resume operate on the same set so ambient motion freezes with a pause.
// ----------------------------------------------------------------------------
let liveTweens = [];
let liveParticles = [];
function killLive() {
  liveTweens.forEach((t) => { try { t.kill(); } catch {} });
  liveParticles.forEach((p) => { try { p.destroy(); } catch {} });
  liveTweens = [];
  liveParticles = [];
}
function pauseLive() { liveTweens.forEach((t) => { try { t.pause(); } catch {} }); }
function resumeLive() { liveTweens.forEach((t) => { try { t.resume(); } catch {} }); }

// ----------------------------------------------------------------------------
//  Playback ownership — one token guards the whole async pipeline. A new
//  player supersedes any prior one; route changes call stopPlayback().
// ----------------------------------------------------------------------------
let playToken = 0;
let activePlayer = null;
let warmed = [];
function stopPlayback() {
  playToken++;
  if (activePlayer) { activePlayer.teardown(); activePlayer = null; }
  killLive();
  warmed = [];
}

// ----------------------------------------------------------------------------
//  Router
// ----------------------------------------------------------------------------
function route() {
  const q = new URLSearchParams(location.search).get("q");
  if (q) renderPlayer(q);
  else renderQuery();
}
window.addEventListener("popstate", route);
route();

// ----------------------------------------------------------------------------
//  View: query input
// ----------------------------------------------------------------------------
function renderQuery() {
  stopPlayback();
  const examples = [
    { label: "Why is the sky blue?", q: "nature" },
    { label: "How does the Norwegian parliament work?", q: "politics" },
    { label: "Hash map vs. B-tree", q: "datastructures" },
  ];
  root.innerHTML = `
    <h1 class="headline rv" style="animation-delay:.12s">
      Ask. Watch. <span class="u">Understand.</span>
    </h1>
    <p class="sub rv" style="animation-delay:.2s">
      AI-generated visual explanations with narration, rendered live in your browser.
    </p>
    <form class="bar rv" id="bar" style="animation-delay:.28s">
      <input id="q" type="text" placeholder="Try: nature" autocomplete="off" autofocus />
      <button id="go" type="submit">
        <span class="sp"></span>
        <span class="lbl">Explain</span>
      </button>
    </form>
    <div class="status rv" id="status" style="animation-delay:.28s">
      <span class="dots"><i></i><i></i><i></i></span>
      <span id="statusText">rendering your lesson</span>
    </div>
    <div class="chips rv" style="animation-delay:.36s">
      ${examples
        .map(
          (e) =>
            `<button type="button" class="chip" data-q="${e.q}">${e.label}</button>`
        )
        .join("")}
    </div>`;

  const qInput = root.querySelector("#q");
  const bar = root.querySelector("#bar");
  const status = root.querySelector("#status");
  const statusText = root.querySelector("#statusText");
  const lbl = root.querySelector("#go .lbl");

  const submit = (q) => {
    q = (q ?? "").trim();
    if (!q) { qInput.focus(); return; }
    bar.classList.add("loading");
    lbl.textContent = "Rendering";
    statusText.textContent = "rendering your lesson";
    status.classList.add("show");
    history.pushState({}, "", `/?q=${encodeURIComponent(q)}`);
    renderPlayer(q);
  };

  bar.onsubmit = (e) => {
    e.preventDefault();
    submit(qInput.value);
  };
  root.querySelectorAll(".chip").forEach((chip) => {
    chip.onclick = () => {
      qInput.value = chip.textContent.trim();
      submit(chip.dataset.q);
    };
  });
}

// ----------------------------------------------------------------------------
//  View: player shell (loading / error / ready states)
// ----------------------------------------------------------------------------
async function renderPlayer(q) {
  stopPlayback();
  root.innerHTML = `
    <div class="player rv" style="animation-delay:.05s">
      <div class="player-top">
        <button id="back" class="back" type="button">&larr; Back</button>
      </div>
      <div id="stageWrap" class="stage-wrap">
        <div id="atmosphere" style="position:absolute;inset:0;pointer-events:none"></div>
        <svg id="stage" viewBox="0 0 ${STAGE_W} ${STAGE_H}" preserveAspectRatio="xMidYMid meet"></svg>
        <div id="status" class="stage-status">Loading\u2026</div>
      </div>
      <div id="caption" class="caption"></div>
      <button id="play" class="play" type="button" disabled>${BTN_PLAY}</button>
    </div>`;
  root.querySelector("#back").onclick = () => {
    stopPlayback();
    history.pushState({}, "", "/");
    renderQuery();
  };

  const status = root.querySelector("#status");
  let lesson;
  try {
    const res = await fetch(`/lesson/${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    lesson = await res.json();
    if (!lesson || !Array.isArray(lesson.scenes) || !lesson.scenes.length)
      throw new Error("lesson has no scenes");
  } catch (e) {
    console.error("lesson load failed:", e);
    status.innerHTML = `<div style="text-align:center">
      Couldn't load this lesson.<br><br>
      <button id="retry">Try again</button></div>`;
    status.querySelector("#retry").onclick = () => renderPlayer(q);
    return;
  }

  document.title = lesson.title ?? "Lesson";
  status.style.display = "none";

  const ctx = {
    wrap: root.querySelector("#stageWrap"),
    atmosphere: root.querySelector("#atmosphere"),
    svg: root.querySelector("#stage"),
    caption: root.querySelector("#caption"),
    playBtn: root.querySelector("#play"),
  };

  if (!gsap) {
    status.style.display = "flex";
    status.textContent = "Animation library unavailable.";
    return;
  }

  // transport: one button drives play -> pause <-> resume -> replay
  let player = null;
  ctx.playBtn.disabled = false;
  ctx.playBtn.onclick = () => {
    if (!player || player.isDone()) {
      player = createPlayer(lesson, ctx);
      player.start();
    } else if (player.isPaused()) {
      player.resume();
    } else {
      player.pause();
    }
  };
}

// ============================================================================
//  DIRECTOR
// ============================================================================
function createPlayer(lesson, ctx) {
  const myToken = ++playToken; // claim ownership, supersede any prior player
  killLive();

  const steps = [];
  for (const scene of lesson.scenes)
    for (const beat of scene.beats ?? []) steps.push({ scene, beat });

  const els = new Map();
  let i = 0;
  let currentSceneId = null;
  let firstScene = true;
  let paused = false;
  let done = false;
  let clock = null;
  let audioEl = null;

  const alive = () => myToken === playToken;
  const setBtn = (label) => { ctx.playBtn.textContent = label; };

  // -- renderer: stand up a scene + its ambient motion (deterministic) -------
  async function buildScene(scene) {
    killLive();
    ctx.atmosphere.innerHTML = "";
    const rng = makeRng(hashString(`${lesson.id ?? ""}:${scene.id ?? ""}`));

    const bg = scene.background ?? lesson.background ?? DEFAULT_BG;
    if (firstScene) ctx.wrap.style.background = bg;
    else gsap.to(ctx.wrap, { backgroundColor: bg, duration: 0.45, ease: "power1.inOut" });
    firstScene = false;

    if (scene.atmosphere && tsParticles) {
      try { await buildAtmosphere(scene.atmosphere, ctx.atmosphere); }
      catch (e) { console.warn("atmosphere failed:", e); }
    }
    if (!alive()) return;

    ctx.svg.innerHTML = "";
    els.clear();
    ensureDefs(ctx.svg);
    const content = mk("g", { "data-role": "content" });
    ctx.svg.appendChild(content);

    // per-element isolation: a bad element is skipped, the rest of the scene lives
    const jobs = [];
    for (const el of scene.elements ?? []) {
      try {
        if (el.type === "graph")
          jobs.push(layoutGraph(el, content, els).catch((e) => console.warn("graph failed:", el?.id, e)));
        else content.appendChild(instantiate(el, els, rng));
      } catch (e) {
        console.error("element render failed:", el?.id, el?.type, e);
      }
    }
    if (jobs.length) await Promise.all(jobs);
    if (!alive()) return;

    els.forEach((node) => { if (node?.dataset?.draw0) primePath(node); });

    // gentle, deterministic drift so particle fields breathe
    content.querySelectorAll('g[data-kind="particles"] > circle').forEach((dot) => {
      liveTweens.push(gsap.to(dot, {
        x: (rng() - 0.5) * 16, y: (rng() - 0.5) * 16,
        duration: 2 + rng() * 2.5, ease: "sine.inOut",
        repeat: -1, yoyo: true, delay: rng() * 1.5,
      }));
    });

    for (const a of scene.ambient ?? []) {
      const node = els.get(a.target);
      if (node) { try { startLoop(node, a); } catch (e) { console.warn("ambient failed:", a, e); } }
    }
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    if (paused) pauseLive(); // honor a pause requested mid-build
  }

  // -- director: play one beat, chain to the next ----------------------------
  async function playStep() {
    if (!alive()) return;
    if (i >= steps.length) {
      done = true;
      setBtn(BTN_REPLAY);
      fadeCaption(ctx.caption, "");
      return;
    }
    const { scene, beat } = steps[i];
    fadeCaption(ctx.caption, beat.narration ?? "");

    if (scene.id !== currentSceneId) {
      await buildScene(scene);
      if (!alive()) return;
      currentSceneId = scene.id;
    }

    // resolve timing from the audio's word timestamps when present, else seconds
    const wordCtx = buildWordMap(beat.audio);
    const rawDur = beat.audio?.duration;
    const knownDur =
      typeof rawDur === "number" && isFinite(rawDur) && rawDur > 0 ? rawDur : null;

    const tl = gsap.timeline({ paused: true });
    for (const a of beat.animations ?? []) {
      const node = els.get(a.target);
      if (!node) { console.warn("unknown target:", a.target); continue; } // drift signal
      const at = Math.max(0, resolveAt(a.at, wordCtx, knownDur) + (a.delay ?? 0));
      try {
        if (a.loop) startLoop(node, a);
        else addAnimation(tl, node, a, els, at);
      } catch (e) {
        console.error("animation failed:", a, e); // isolated: keep the beat going
      }
    }
    const tlDur = tl.duration();
    const beatDur = knownDur ?? (tlDur > 0 ? tlDur + 0.4 : 3);
    const maxWait = beatDur + 4; // hard cap: a silent/404 clip can't hang the lesson

    // narration is best-effort; advance on its real end, with the cap as backstop
    audioEl = new Audio(beat.audio?.url || "");
    audioEl.preload = "auto";
    let audioDone = false;
    audioEl.addEventListener("ended", () => { audioDone = true; }, { once: true });
    audioEl.addEventListener("error", () => { audioDone = true; }, { once: true });
    audioEl.play().catch(() => { audioDone = true; });
    warmAudio(steps[i + 1]?.beat?.audio?.url); // gapless: prefetch the next clip

    clock = createClock();
    if (paused) { clock.pause(); try { audioEl.pause(); } catch {} }

    function tick() {
      if (!alive()) return;
      if (paused) { requestAnimationFrame(tick); return; } // frozen: hold, don't advance
      const elapsed = clock.now();
      if (tlDur > 0) {
        try {
          tl.time(Math.min(elapsed, tlDur));
          if (elapsed >= tlDur) tl.progress(1); // visuals settle on time
        } catch (e) {
          console.error("timeline tick failed (continuing):", e); // isolated: don't kill the lesson
        }
      }
      if (elapsed >= beatDur && (audioDone || elapsed >= maxWait)) {
        try { audioEl.pause(); } catch {}
        i++;
        playStep();
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const controller = {
    isPaused: () => paused,
    isDone: () => done,
    start() {
      i = 0; currentSceneId = null; firstScene = true; paused = false; done = false;
      setBtn(BTN_PAUSE);
      playStep();
    },
    pause() {
      if (paused || done) return;
      paused = true;
      if (clock) clock.pause();
      if (audioEl) { try { audioEl.pause(); } catch {} }
      pauseLive();
      setBtn(BTN_RESUME);
    },
    resume() {
      if (!paused || done) return;
      paused = false;
      if (clock) clock.resume();
      if (audioEl) audioEl.play().catch(() => {});
      resumeLive();
      setBtn(BTN_PAUSE);
    },
    teardown() {
      if (audioEl) { try { audioEl.pause(); } catch {} audioEl = null; }
    },
  };
  activePlayer = controller;
  return controller;
}

function fadeCaption(node, text) {
  if (!node) return;
  node.style.opacity = 0;
  setTimeout(() => { node.textContent = text; node.style.opacity = 1; }, 180);
}

// gapless audio: warm the next clip into the HTTP cache (kept briefly so GC
// doesn't drop it before the beat that needs it)
function warmAudio(url) {
  if (!url) return;
  const a = new Audio(url);
  a.preload = "auto";
  try { a.load(); } catch {}
  warmed.push(a);
  while (warmed.length > 3) warmed.shift();
}

// ============================================================================
//  TIMING — word-anchored resolution (the long-promised hook, now cashed in)
//  Accepts:  at: 1.2                              (seconds, back-compat)
//            at: { word: "scatters" }             (start of that word)
//            at: { word: "the", nth: 2 }          (2nd occurrence)
//            at: { word: "blue", offset: 0.1 }    (+0.1s after the word)
//            at: { fraction: 0.5 }                (half-way through the beat)
//            at: { t: 1.2 }                       (explicit seconds in object form)
//  audio.words: [{ word, start }]  — supplied by the TTS step.
// ============================================================================
function buildWordMap(audio) {
  if (!Array.isArray(audio?.words)) return null;
  const map = new Map();
  for (const w of audio.words) {
    const key = normalizeWord(w.word);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w.start);
  }
  return map;
}
function normalizeWord(w) {
  return String(w ?? "").toLowerCase().replace(/[^a-z0-9']/g, "");
}
function resolveAt(at, wordMap, beatDur) {
  if (typeof at === "number") return at;
  if (at && typeof at === "object") {
    const offset = at.offset ?? 0;
    if (at.word != null) {
      if (wordMap) {
        const arr = wordMap.get(normalizeWord(at.word));
        const idx = (at.nth ?? 1) - 1;
        if (arr && arr[idx] != null) return arr[idx] + offset;
      }
      console.warn("word anchor unresolved:", at.word); // drift signal
    }
    if (at.t != null) return at.t + offset;
    if (at.fraction != null) return at.fraction * (beatDur ?? 0) + offset;
  }
  return 0;
}

// ============================================================================
//  RENDERER — vocabulary -> SVG / DOM
// ============================================================================
function mk(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  return n;
}

function ensureDefs(svg) {
  const defs = mk("defs", {});
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6.5" refY="3.5"
            orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L7,3.5 L0,7 Z" fill="context-stroke" stroke="none"></path>
    </marker>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0b1a2e" flood-opacity="0.18"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
  svg.appendChild(defs);
}

function instantiate(el, els, rng) {
  const node = createElement(el, rng);
  els.set(el.id, node);
  if (el.type === "group" && Array.isArray(el.props?.children))
    for (const child of el.props.children) node.appendChild(instantiate(child, els, rng));
  return node;
}

// shared labeled rectangle (used by `box` and elk graph nodes)
function renderBox(p) {
  const g = mk("g", {});
  const rect = mk("rect", {
    x: p.x, y: p.y, width: p.w, height: p.h, rx: p.rx ?? 8,
    fill: p.fill ?? "#ffffff", stroke: p.stroke ?? "#8895a7", "stroke-width": 2,
    filter: p.shadow === false ? null : "url(#softShadow)",
  });
  rect.dataset.role = "box-bg";
  g.appendChild(rect);
  if (p.label != null) {
    const t = mk("text", {
      x: p.x + p.w / 2, y: p.y + p.h / 2, fill: p.labelFill ?? "#1f2d3d",
      "font-size": p.fontSize ?? 15, "text-anchor": "middle",
      "dominant-baseline": "central", "font-family": "system-ui, sans-serif", "font-weight": 600,
    });
    t.textContent = p.label;
    t.dataset.role = "box-label";
    g.appendChild(t);
  }
  return g;
}

function createElement(el, rng = Math.random) {
  const { type, props = {} } = el;
  let node;
  switch (type) {
    case "circle":
      node = mk("circle", { cx: props.x, cy: props.y, r: props.r, fill: props.fill,
                            stroke: props.stroke, "stroke-width": props.strokeWidth });
      if (props.glow) node.setAttribute("filter", "url(#glow)");
      break;

    case "rect":
      node = mk("rect", { x: props.x, y: props.y, width: props.w, height: props.h, rx: props.rx,
        fill: props.fill, stroke: props.stroke,
        "stroke-width": props.stroke ? props.strokeWidth ?? 1.5 : null });
      break;

    case "arrow": {
      node = mk("path", {
        d: `M${props.x1},${props.y1} L${props.x2},${props.y2}`,
        stroke: props.stroke ?? "#90a4b5", "stroke-width": props.strokeWidth ?? 2,
        fill: "none", "marker-end": "url(#arrowhead)", "stroke-linecap": "round",
      });
      if (props.draw === 0) node.dataset.draw0 = "1";
      break;
    }

    case "path":
      node = mk("path", { d: props.d, stroke: props.stroke, "stroke-width": props.strokeWidth,
                          fill: props.fill ?? "none", "stroke-linecap": "round" });
      if (props.glow) node.setAttribute("filter", "url(#glow)");
      if (props.draw === 0) node.dataset.draw0 = "1";
      break;

    case "text":
      node = mk("text", { x: props.x, y: props.y, fill: props.fill, "font-size": props.fontSize,
        "text-anchor": props.anchor, "font-weight": props.weight,
        "font-family": "system-ui, sans-serif" });
      node.textContent = props.text ?? "";
      if (props.format) node.dataset.format = props.format; // d3.format spec for countTo
      if (props.prefix != null) node.dataset.prefix = props.prefix;
      if (props.suffix != null) node.dataset.suffix = props.suffix;
      break;

    case "box":
      node = renderBox(props);
      break;

    case "group":
      node = mk("g", {});
      break;

    case "particles": {
      node = mk("g", {});
      const count = props.count ?? 40;
      const rx = props.x ?? 0, ry = props.y ?? 0, rw = props.w ?? STAGE_W, rh = props.h ?? STAGE_H;
      const color = props.color ?? "#9fd3ff";
      for (let k = 0; k < count; k++) {
        const dot = mk("circle", {
          cx: rx + rng() * rw, cy: ry + rng() * rh, r: 1 + rng() * 2, fill: color,
        });
        dot.style.opacity = 0.3 + rng() * 0.5;
        node.appendChild(dot);
      }
      break;
    }

    case "arc":
      if (!d3) { console.warn("arc needs d3"); node = mk("g", {}); break; }
      node = buildArc(props);
      break;

    case "axis":
      if (!d3) { console.warn("axis needs d3"); node = mk("g", {}); break; }
      node = buildAxis(props);
      break;

    default:
      console.warn("unknown element type:", type); // drift signal
      node = mk("g", {});
  }
  node.dataset.kind = type;
  if (props.x != null) node.dataset.baseX = props.x;
  if (props.y != null) node.dataset.baseY = props.y;
  if (props.opacity != null) node.style.opacity = props.opacity;
  return node;
}

// ---------- d3: arc / pie / donut ----------
function buildArc(props) {
  const g = mk("g", { transform: `translate(${props.x ?? 0},${props.y ?? 0})` });
  const inner = props.innerRadius ?? 0;
  const outer = props.outerRadius ?? props.r ?? 60;
  if (Array.isArray(props.segments)) {
    const pie = d3.pie().sort(null).value((d) => d.value);
    const arcGen = d3.arc().innerRadius(inner).outerRadius(outer)
      .padAngle(props.padAngle ?? 0.012).cornerRadius(props.cornerRadius ?? 2);
    pie(props.segments).forEach((s, idx) => {
      const seg = mk("path", { d: arcGen(s),
        fill: props.segments[idx].color ?? d3.schemeTableau10[idx % 10] });
      seg.dataset.role = "arc-seg";
      g.appendChild(seg);
    });
  } else {
    const arcGen = d3.arc().innerRadius(inner).outerRadius(outer)
      .startAngle(props.startAngle ?? 0).endAngle(props.endAngle ?? Math.PI);
    const seg = mk("path", { d: arcGen(), fill: props.fill ?? "#888" });
    seg.dataset.role = "arc-seg";
    g.appendChild(seg);
  }
  return g;
}

// ---------- d3: scaled, ticked axis ----------
function buildAxis(props) {
  const g = mk("g", { transform: `translate(${props.x ?? 0},${props.y ?? 0})` });
  const scale = d3.scaleLinear().domain(props.domain ?? [0, 100]).range(props.range ?? [0, 400]);
  const orient = props.orient ?? "bottom";
  const gen = (orient === "left" ? d3.axisLeft : orient === "right" ? d3.axisRight
    : orient === "top" ? d3.axisTop : d3.axisBottom)(scale).ticks(props.ticks ?? 5);
  const sel = d3.select(g);
  sel.call(gen);
  sel.selectAll("path,line").attr("stroke", props.stroke ?? "#90a4b5");
  sel.selectAll("text").attr("fill", props.tickFill ?? "#9fb3c8")
    .attr("font-size", 11).attr("font-family", "system-ui, sans-serif");
  return g;
}

// ---------- elkjs: auto-laid-out graphs ----------
async function layoutGraph(el, parent, els) {
  const props = el.props ?? {};
  const g = mk("g", { transform: `translate(${props.x ?? 0},${props.y ?? 0})` });
  g.dataset.kind = "graph";
  parent.appendChild(g);
  els.set(el.id, g);
  if (!elk) { console.warn("graph needs elkjs"); return; }

  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  const nw = props.nodeWidth ?? 90, nh = props.nodeHeight ?? 40;

  const res = await elk.layout({
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": props.direction ?? "DOWN",
      "elk.layered.spacing.nodeNodeBetweenLayers": String(props.layerGap ?? 50),
      "elk.spacing.nodeNode": String(props.nodeGap ?? 30),
    },
    children: nodes.map((n) => ({ id: n.id, width: n.width ?? nw, height: n.height ?? nh })),
    edges: edges.map((e, idx) => ({ id: e.id ?? `e${idx}`, sources: [e.from], targets: [e.to] })),
  });

  res.children.forEach((c) => {
    const spec = nodes.find((n) => n.id === c.id) ?? {};
    const box = renderBox({ x: c.x, y: c.y, w: c.width, h: c.height,
      label: spec.label, fill: spec.fill, stroke: spec.stroke });
    box.dataset.kind = "box";
    box.dataset.baseX = c.x;
    box.dataset.baseY = c.y;
    g.appendChild(box);
    els.set(c.id, box);
  });
  (res.edges ?? []).forEach((e) => {
    const sec = e.sections?.[0];
    if (!sec) return;
    let d = `M${sec.startPoint.x},${sec.startPoint.y} `;
    (sec.bendPoints ?? []).forEach((b) => { d += `L${b.x},${b.y} `; });
    d += `L${sec.endPoint.x},${sec.endPoint.y}`;
    const path = mk("path", { d, stroke: props.edgeStroke ?? "#90a4b5", "stroke-width": 2,
      fill: "none", "marker-end": "url(#arrowhead)" });
    path.dataset.kind = "path";
    if (props.drawEdges) path.dataset.draw0 = "1";
    g.appendChild(path);
    els.set(e.id, path);
  });
}

// ---------- tsParticles: optional full-bleed atmosphere (behind content) ----------
async function buildAtmosphere(spec, host) {
  const c = await tsParticles.load({
    element: host,
    options: {
      fullScreen: { enable: false },
      detectRetina: true,
      background: { color: "transparent" },
      particles: {
        number: { value: spec.count ?? 50 },
        color: { value: spec.color ?? "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: { min: 0.15, max: 0.7 } },
        size: { value: { min: 0.6, max: 2.2 } },
        move: { enable: true, speed: spec.speed ?? 0.35, direction: "none",
                random: true, straight: false, outModes: { default: "out" } },
        links: spec.links
          ? { enable: true, distance: 110, opacity: 0.12, color: spec.color ?? "#ffffff" }
          : { enable: false },
      },
    },
  });
  if (c) liveParticles.push(c);
}

// ---------- path helpers ----------
function primePath(path) {
  if (typeof path.getTotalLength !== "function") return;
  const len = path.getTotalLength();
  if (!len) return;
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
}

// interpolate two `d` strings of identical command structure (no MorphSVG plugin)
function interpolateD(d0, d1) {
  const re = /-?\d*\.?\d+(?:e-?\d+)?/gi;
  const a = d0.match(re)?.map(Number) ?? [];
  const b = d1.match(re)?.map(Number) ?? [];
  const scaffold = d1.split(re);
  if (a.length !== b.length) return () => d1; // mismatched shapes: snap
  return (t) => {
    let out = "";
    for (let k = 0; k < b.length; k++)
      out += scaffold[k] + Math.round((a[k] + (b[k] - a[k]) * t) * 100) / 100;
    return out + scaffold[scaffold.length - 1];
  };
}

function staggerTargets(node, kind, stagger) {
  return stagger && (kind === "group" || kind === "graph") ? [...node.children] : node;
}

// ============================================================================
//  ANIMATION — discrete ops (seeked, per-beat timeline). `at` is pre-resolved.
// ============================================================================
function addAnimation(tl, node, a, els, at) {
  const dur = a.duration ?? 0.6;
  const to = a.to ?? {};
  const kind = node.dataset?.kind;

  switch (a.op) {
    case "fadeIn":
      if (a.stagger && kind === "group") {
        node.style.opacity = 1;
        const kids = [...node.children];
        kids.forEach((k) => (k.style.opacity = 0));
        tl.to(kids, { opacity: 1, duration: dur, ease: a.ease ?? "power1.out", stagger: a.stagger }, at);
      } else {
        tl.to(node, { opacity: 1, duration: dur, ease: a.ease ?? "power1.out" }, at);
      }
      break;

    case "fadeOut":
      tl.to(node, { opacity: 0, duration: dur, ease: a.ease ?? "power1.in" }, at);
      break;

    case "moveTo":
      if (kind === "circle") {
        tl.to(node, { attr: { cx: to.x, cy: to.y }, duration: dur, ease: a.ease ?? "power2.inOut" }, at);
      } else {
        const bx = +(node.dataset.baseX ?? 0), by = +(node.dataset.baseY ?? 0);
        tl.to(node, { x: to.x - bx, y: to.y - by, duration: dur, ease: a.ease ?? "power2.inOut" }, at);
      }
      break;

    case "scale":
      tl.to(staggerTargets(node, kind, a.stagger),
        { scale: to.scale ?? 1.2, transformOrigin: "50% 50%", duration: dur,
          ease: a.ease ?? "back.out(2)", stagger: a.stagger }, at);
      break;

    case "drawPath":
      tl.to(node, { strokeDashoffset: 0, duration: dur, ease: a.ease ?? "power1.inOut" }, at);
      break;

    case "highlight": {
      let targets;
      if (kind === "box") targets = node.querySelectorAll('[data-role="box-bg"]');
      else if (kind === "group" || kind === "graph" || kind === "particles")
        targets = node.querySelectorAll("circle, rect, path");
      else if (kind === "arc") targets = node.querySelectorAll('[data-role="arc-seg"]');
      else targets = [node];
      targets = [...targets];
      if (!targets.length) break;
      const attrs = {};
      if (to.fill) attrs.fill = to.fill;
      if (to.color) attrs.fill = to.color; // particles alias
      if (to.stroke) attrs.stroke = to.stroke;
      if (Object.keys(attrs).length)
        tl.to(targets, { attr: attrs, duration: dur, ease: a.ease, stagger: a.stagger }, at);
      break;
    }

    case "motionPath": {
      const guide = els.get(a.path);
      if (!guide || typeof guide.getTotalLength !== "function") {
        console.warn("motionPath: missing/invalid guide path:", a.path);
        break;
      }
      const total = guide.getTotalLength();
      if (!Number.isFinite(total) || total <= 0) {
        console.warn("motionPath: guide path has zero/invalid length:", a.path);
        break;
      }
      const proxy = { p: a.from ?? 0 };
      const isCircle = kind === "circle";
      const bx = +(node.dataset.baseX ?? 0), by = +(node.dataset.baseY ?? 0);
      tl.to(proxy, {
        p: a.to ?? 1, duration: dur, ease: a.ease ?? "none",
        onUpdate: () => {
          const len = proxy.p * total;
          if (!Number.isFinite(len)) return; // bad from/to from the LLM — skip frame
          const pt = guide.getPointAtLength(len);
          if (isCircle) {
            node.setAttribute("cx", pt.x);
            node.setAttribute("cy", pt.y);
          } else if (a.autoRotate) {
            const ah = guide.getPointAtLength(Math.min(len + 1, total));
            gsap.set(node, { x: pt.x - bx, y: pt.y - by,
              rotation: Math.atan2(ah.y - pt.y, ah.x - pt.x) * 180 / Math.PI,
              transformOrigin: "50% 50%" });
          } else {
            gsap.set(node, { x: pt.x - bx, y: pt.y - by });
          }
        },
      }, at);
      break;
    }

    case "morph": {
      if (!to.d) break;
      const interp = interpolateD(node.getAttribute("d") || "", to.d);
      const proxy = { t: 0 };
      tl.to(proxy, { t: 1, duration: dur, ease: a.ease ?? "power1.inOut",
        onUpdate: () => node.setAttribute("d", interp(proxy.t)) }, at);
      break;
    }

    case "countTo": {
      if (!d3) { console.warn("countTo needs d3"); break; }
      const fmt = node.dataset.format ? d3.format(node.dataset.format) : (v) => Math.round(v);
      const pre = node.dataset.prefix ?? "";
      const suf = node.dataset.suffix ?? "";
      const from = a.from ?? (Number((node.textContent || "").replace(/[^\d.-]/g, "")) || 0);
      const proxy = { v: from };
      tl.to(proxy, { v: to.value ?? 0, duration: dur, ease: a.ease ?? "power1.out",
        onUpdate: () => { node.textContent = pre + fmt(proxy.v) + suf; } }, at);
      break;
    }

    default:
      console.warn("unknown op:", a.op); // drift signal
  }
}

// ============================================================================
//  ANIMATION — continuous ops (run free; paused with the player, killed on
//  scene change). Triggered by scene.ambient[] or an animation with loop:true.
// ============================================================================
function startLoop(node, a) {
  const dur = a.duration ?? 2;
  const ease = a.ease ?? "sine.inOut";
  const to = a.to ?? {};
  const kind = node.dataset?.kind;
  const targets = staggerTargets(node, kind, a.stagger);
  const stagger = a.stagger ? { each: a.stagger, repeat: -1, yoyo: true } : undefined;
  let tw;
  switch (a.op) {
    case "pulse":   tw = gsap.to(targets, { scale: to.scale ?? 1.06, transformOrigin: "50% 50%", duration: dur, ease, repeat: -1, yoyo: true, stagger }); break;
    case "float":   tw = gsap.to(targets, { y: to.y ?? -6, duration: dur, ease, repeat: -1, yoyo: true, stagger }); break;
    case "drift":   tw = gsap.to(targets, { x: to.x ?? 6, y: to.y ?? -4, duration: dur, ease, repeat: -1, yoyo: true, stagger }); break;
    case "sway":    tw = gsap.to(targets, { rotation: to.rotation ?? 3, transformOrigin: "50% 100%", duration: dur, ease, repeat: -1, yoyo: true, stagger }); break;
    case "spin":    tw = gsap.to(targets, { rotation: to.rotation ?? 360, transformOrigin: "50% 50%", duration: dur, ease: "none", repeat: -1 }); break;
    case "twinkle": tw = gsap.to(targets, { opacity: to.opacity ?? 0.4, duration: dur, ease, repeat: -1, yoyo: true, stagger }); break;
    default: console.warn("unknown loop op:", a.op); return;
  }
  liveTweens.push(tw);
}
