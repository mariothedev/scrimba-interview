const natureDurations = (n: number) : Record<number, number> => ({
  0: 2,
  1: 2,
  2: 2,
  3: 4,
});

const N = (n: number) => ({
  url: `https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/why-is-the-sky-blue/${n}.mp3`,
  duration: natureDurations(n)[n],
});

const parliamentDurations = (n: number) : Record<number, number> => ({
  0: 2,
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
});

const P = (n: number) => ({
  url: `https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/how-norway-parliament-works/${n}.mp3`,
  duration: parliamentDurations(n)[n],
});

const dsDurations = (n: number) : Record<number, number> => ({
  0: 3,
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 4,
});

const D = (n: number) => ({
  url: `https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/hash-map-vs-b-tree/${n}.mp3`,
  duration: dsDurations(n)[n],
});


const blocColor = (t: number) =>
  t < 0.16 ? "#8e1b1b" :
  t < 0.34 ? "#d6322a" :
  t < 0.50 ? "#16a34a" :
  t < 0.62 ? "#0ea5a0" :
  t < 0.72 ? "#eab308" :
  t < 0.88 ? "#2563c0" : "#1e293b";

// 169 seats fanned into concentric rows — generated, not hand-placed
const stortingSeats = () => {
  const cx = 350, cy = 275, r0 = 64, dr = 15;
  const rowCounts = [9, 12, 15, 18, 21, 23, 24, 24, 23]; // = 169
  const seats: any[] = [];
  let idx = 0;
  rowCounts.forEach((n, row) => {
    const r = r0 + row * dr;
    for (let k = 0; k < n; k++) {
      const t = n === 1 ? 0.5 : k / (n - 1);
      const ang = Math.PI + t * Math.PI; // π (left) .. 2π (right), opening upward
      seats.push({
        id: `seat-${idx++}`,
        type: "circle",
        props: {
          x: Math.round(cx + r * Math.cos(ang)),
          y: Math.round(cy + r * Math.sin(ang)),
          r: 5, fill: blocColor(t), opacity: 1,
        },
      });
    }
  });
  return seats;
};

const MOCK: Record<string, unknown> = {

    nature: {
        id: "why-is-the-sky-blue",
        title: "Why is the sky blue?",
        background: "#0a1230",
        scenes: [
            {
                id: "scene-sunlight",
                background: "#0a1230",
                atmosphere: { count: 45, color: "#9fb6ff", speed: 0.12 }, // faint starfield behind
                ambient: [
                    { target: "sun", op: "pulse", to: { scale: 1.05 }, duration: 2.2 }, // sun breathes
                ],
                elements: [
                    { id: "sun", type: "circle", props: { x: 110, y: 100, r: 44, fill: "#ffd84d", glow: true, opacity: 0 } },
                    { id: "ray", type: "path", props: { d: "M152,112 L352,204", stroke: "#ffffff", strokeWidth: 5, glow: true, draw: 0 } },
                    { id: "splitDot", type: "circle", props: { x: 352, y: 204, r: 3, fill: "#ffffff", opacity: 0 } },
                    { id: "specLabel", type: "text", props: { x: 350, y: 36, text: "Sunlight = every color mixed", fill: "#dfe8ff", fontSize: 16, weight: 600, anchor: "middle", opacity: 0 } },
                    // white light fanned into its spectrum (each ray drawn in, staggered)
                    { id: "cRed",    type: "path", props: { d: "M352,204 L600,158", stroke: "#ff4d4d", strokeWidth: 3, draw: 0 } },
                    { id: "cOrange", type: "path", props: { d: "M352,204 L602,174", stroke: "#ff9a3c", strokeWidth: 3, draw: 0 } },
                    { id: "cYellow", type: "path", props: { d: "M352,204 L606,190", stroke: "#ffe04d", strokeWidth: 3, draw: 0 } },
                    { id: "cGreen",  type: "path", props: { d: "M352,204 L602,206", stroke: "#5fd06a", strokeWidth: 3, draw: 0 } },
                    { id: "cCyan",   type: "path", props: { d: "M352,204 L600,222", stroke: "#46c7d6", strokeWidth: 3, draw: 0 } },
                    { id: "cBlue",   type: "path", props: { d: "M352,204 L600,238", stroke: "#4a8cff", strokeWidth: 3, draw: 0 } },
                    { id: "cViolet", type: "path", props: { d: "M352,204 L598,254", stroke: "#9b5cff", strokeWidth: 3, draw: 0 } },
                ],
                beats: [
                    {
                        narration: "Sunlight looks white.",
                        audio: N(0),
                        animations: [
                            { target: "sun", op: "fadeIn", at: 0.2, duration: 0.6 },
                            { target: "ray", op: "drawPath", at: 0.9, duration: 1.0 },
                        ],
                    },
                    {
                        narration: "But it's really a mix of every color.",
                        audio: N(1),
                        animations: [
                            { target: "specLabel", op: "fadeIn", at: 0.1, duration: 0.5 },
                            { target: "splitDot", op: "fadeIn", at: 0.2, duration: 0.3 },
                            { target: "cRed",    op: "drawPath", at: 0.30, duration: 0.7 },
                            { target: "cOrange", op: "drawPath", at: 0.42, duration: 0.7 },
                            { target: "cYellow", op: "drawPath", at: 0.54, duration: 0.7 },
                            { target: "cGreen",  op: "drawPath", at: 0.66, duration: 0.7 },
                            { target: "cCyan",   op: "drawPath", at: 0.78, duration: 0.7 },
                            { target: "cBlue",   op: "drawPath", at: 0.90, duration: 0.7 },
                            { target: "cViolet", op: "drawPath", at: 1.02, duration: 0.7 },
                        ],
                    },
                ],
            },
            {
                id: "scene-scattering",
                background: "#5aa6ec", // dark space -> daytime sky on the scene cross-fade
                ambient: [
                    { target: "sun2", op: "pulse", to: { scale: 1.05 }, duration: 2.4 },
                    { target: "hub",  op: "pulse", to: { scale: 1.3 }, duration: 1.2 }, // scattering site, alive
                ],
                elements: [
                    // translucent sky tint that deepens on the final beat ("glows blue")
                    { id: "skyGlow", type: "rect", props: { x: 0, y: 0, w: 700, h: 360, fill: "#1f6fd6", opacity: 0 } },
                    { id: "sun2", type: "circle", props: { x: 44, y: 48, r: 30, fill: "#fff3b0", glow: true, opacity: 0 } },
                    { id: "beam", type: "path", props: { d: "M70,64 L350,180", stroke: "#ffffff", strokeWidth: 4, draw: 0 } },
                    { id: "molecules", type: "particles", props: { count: 64, color: "#eaf6ff", opacity: 0 } },
                    { id: "hub", type: "circle", props: { x: 350, y: 180, r: 7, fill: "#dff1ff", stroke: "#ffffff", strokeWidth: 1.5, opacity: 0 } },
                    { id: "scatterLabel", type: "text", props: { x: 350, y: 34, text: "Short blue waves scatter the most", fill: "#ffffff", fontSize: 16, weight: 600, anchor: "middle", opacity: 0 } },
                    // red keeps going straight; blue ricochets in every direction
                    { id: "redRay", type: "path", props: { d: "M350,180 L656,312", stroke: "#ff5a3c", strokeWidth: 3, draw: 0 } },
                    // invisible guide paths for the scattered blue photons
                    { id: "gA", type: "path", props: { d: "M350,180 L530,86",  stroke: "transparent", strokeWidth: 0 } },
                    { id: "gB", type: "path", props: { d: "M350,180 L585,180", stroke: "transparent", strokeWidth: 0 } },
                    { id: "gC", type: "path", props: { d: "M350,180 L500,300", stroke: "transparent", strokeWidth: 0 } },
                    { id: "gD", type: "path", props: { d: "M350,180 L200,110", stroke: "transparent", strokeWidth: 0 } },
                    { id: "gE", type: "path", props: { d: "M350,180 L250,300", stroke: "transparent", strokeWidth: 0 } },
                    { id: "pA", type: "circle", props: { x: 350, y: 180, r: 4, fill: "#1f5fd6", opacity: 0 } },
                    { id: "pB", type: "circle", props: { x: 350, y: 180, r: 4, fill: "#1f5fd6", opacity: 0 } },
                    { id: "pC", type: "circle", props: { x: 350, y: 180, r: 4, fill: "#1f5fd6", opacity: 0 } },
                    { id: "pD", type: "circle", props: { x: 350, y: 180, r: 4, fill: "#1f5fd6", opacity: 0 } },
                    { id: "pE", type: "circle", props: { x: 350, y: 180, r: 4, fill: "#1f5fd6", opacity: 0 } },
                ],
                beats: [
                    {
                        narration: "The air is full of tiny molecules.",
                        audio: N(2),
                        animations: [
                            { target: "sun2", op: "fadeIn", at: 0.1, duration: 0.5 },
                            { target: "beam", op: "drawPath", at: 0.4, duration: 0.9 },
                            { target: "molecules", op: "fadeIn", at: 0.3, duration: 0.8 },
                            { target: "hub", op: "fadeIn", at: 0.6, duration: 0.4 },
                        ],
                    },
                    {
                        narration: "Blue light scatters off them, so the whole sky glows blue.",
                        audio: N(3),
                        animations: [
                            { target: "scatterLabel", op: "fadeIn", at: 0.2, duration: 0.5 },
                            { target: "redRay", op: "drawPath", at: 0.5, duration: 1.0 },
                            // blue photons ricochet outward from the molecule, staggered
                            { target: "pA", op: "fadeIn", at: 0.70, duration: 0.2 },
                            { target: "pA", op: "motionPath", path: "gA", at: 0.80, duration: 1.1, from: 0, to: 1 },
                            { target: "pB", op: "fadeIn", at: 0.88, duration: 0.2 },
                            { target: "pB", op: "motionPath", path: "gB", at: 0.98, duration: 1.1, from: 0, to: 1 },
                            { target: "pC", op: "fadeIn", at: 1.06, duration: 0.2 },
                            { target: "pC", op: "motionPath", path: "gC", at: 1.16, duration: 1.1, from: 0, to: 1 },
                            { target: "pD", op: "fadeIn", at: 1.24, duration: 0.2 },
                            { target: "pD", op: "motionPath", path: "gD", at: 1.34, duration: 1.1, from: 0, to: 1 },
                            { target: "pE", op: "fadeIn", at: 1.42, duration: 0.2 },
                            { target: "pE", op: "motionPath", path: "gE", at: 1.52, duration: 1.1, from: 0, to: 1 },
                            // the air itself turns blue, and the sky tint deepens
                            { target: "molecules", op: "highlight", at: 1.6, duration: 1.0, to: { color: "#2f7bff" } },
                            { target: "skyGlow", op: "fadeIn", at: 1.8, duration: 1.4, ease: "power1.inOut" },
                        ],
                    },
                ],
            },
        ],
    },

    politics: {
        id: "how-norway-parliament-works",
        title: "How does the Norwegian parliament work?",
        background: "#f7f9fc",
        scenes: [
            {
                id: "scene-storting",
                background: "#f7f9fc",
                ambient: [
                    { target: "seats", op: "pulse", to: { scale: 1.02 }, duration: 4 }, // chamber breathes
                ],
                elements: [
                    { id: "stortingLabel", type: "text", props: { x: 350, y: 44, text: "Stortinget", fill: "#1f2d3d", fontSize: 26, weight: 700, anchor: "middle", opacity: 0 } },
                    { id: "seats", type: "group", props: { x: 0, y: 0, opacity: 0, children: stortingSeats() } },
                    { id: "bigNum", type: "text", props: { x: 350, y: 246, text: "0", fill: "#1f2d3d", fontSize: 34, weight: 700, anchor: "middle", opacity: 0 } },
                    { id: "subLabel", type: "text", props: { x: 350, y: 312, text: "representatives · elected every 4 years", fill: "#5a6b7b", fontSize: 15, anchor: "middle", opacity: 0 } },
                ],
                beats: [
                    {
                        narration: "Norway's parliament is called the Storting.",
                        audio: P(0),
                        animations: [
                            { target: "stortingLabel", op: "fadeIn", at: 0.1, duration: 0.5 },
                            { target: "seats", op: "fadeIn", at: 0.4, duration: 0.4, stagger: 0.006 }, // 169 seats cascade in
                        ],
                    },
                    {
                        narration: "Its 169 representatives are elected every four years.",
                        audio: P(1),
                        animations: [
                            { target: "bigNum", op: "fadeIn", at: 0.1, duration: 0.4 },
                            { target: "bigNum", op: "countTo", at: 0.3, duration: 1.6, to: { value: 169 } }, // matches the dots
                            { target: "subLabel", op: "fadeIn", at: 0.5, duration: 0.6 },
                        ],
                    },
                ],
            },
            {
                id: "scene-how-a-law-passes",
                background: "#f7f9fc",
                elements: [
                    { id: "lawTitle", type: "text", props: { x: 350, y: 40, text: "How a bill becomes law", fill: "#1f2d3d", fontSize: 22, weight: 700, anchor: "middle", opacity: 0 } },

                    // the pipeline rail + five stations
                    { id: "rail", type: "path", props: { d: "M76,150 L621,150", stroke: "#cdd6e0", strokeWidth: 3, draw: 0 } },
                    { id: "stProposal", type: "box", props: { x: 24, y: 170, w: 104, h: 54, label: "Proposal", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
                    { id: "stCommittee", type: "box", props: { x: 160, y: 170, w: 104, h: 54, label: "Committee", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
                    { id: "stDebate", type: "box", props: { x: 296, y: 170, w: 104, h: 54, label: "Debate", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
                    { id: "stVote", type: "box", props: { x: 432, y: 170, w: 104, h: 54, label: "Vote", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
                    { id: "stAssent", type: "box", props: { x: 566, y: 170, w: 110, h: 54, label: "Royal Assent", fill: "#fdf3da", stroke: "#caa23a", opacity: 0 } },

                    // rail -> station drop connectors
                    { id: "cProp", type: "arrow", props: { x1: 76, y1: 150, x2: 76, y2: 168, stroke: "#90a4b5", strokeWidth: 2, draw: 0 } },
                    { id: "cComm", type: "arrow", props: { x1: 212, y1: 150, x2: 212, y2: 168, stroke: "#90a4b5", strokeWidth: 2, draw: 0 } },
                    { id: "cDeb", type: "arrow", props: { x1: 348, y1: 150, x2: 348, y2: 168, stroke: "#90a4b5", strokeWidth: 2, draw: 0 } },
                    { id: "cVote", type: "arrow", props: { x1: 484, y1: 150, x2: 484, y2: 168, stroke: "#90a4b5", strokeWidth: 2, draw: 0 } },
                    { id: "cAss", type: "arrow", props: { x1: 621, y1: 150, x2: 621, y2: 168, stroke: "#90a4b5", strokeWidth: 2, draw: 0 } },

                    // vote outcome + royal seal (revealed late)
                    { id: "voteCheck", type: "path", props: { d: "M472,197 L481,207 L498,183", stroke: "#27ae60", strokeWidth: 4, draw: 0 } },
                    { id: "passedLabel", type: "text", props: { x: 484, y: 140, text: "majority", fill: "#27ae60", fontSize: 13, weight: 600, anchor: "middle", opacity: 0 } },
                    { id: "seal", type: "circle", props: { x: 621, y: 197, r: 24, fill: "none", stroke: "#caa23a", strokeWidth: 3, opacity: 0 } },
                    { id: "signedLabel", type: "text", props: { x: 350, y: 330, text: "Signed into law", fill: "#caa23a", fontSize: 18, weight: 700, anchor: "middle", opacity: 0 } },

                    // motion guide (invisible) + the travelling bill
                    { id: "billRoute", type: "path", props: { d: "M76,150 L621,150", stroke: "transparent", strokeWidth: 0 } },
                    { id: "bill", type: "circle", props: { x: 76, y: 150, r: 11, fill: "#f1c40f", glow: true, opacity: 0 } },
                ],
                beats: [
                    {
                        narration: "Anyone in the Storting can propose a new bill.",
                        audio: P(2),
                        animations: [
                            { target: "lawTitle", op: "fadeIn", at: 0.1, duration: 0.5 },
                            { target: "rail", op: "drawPath", at: 0.3, duration: 0.8 },
                            { target: "stProposal", op: "fadeIn", at: 0.5, duration: 0.4 },
                            { target: "cProp", op: "drawPath", at: 0.8, duration: 0.4 },
                            { target: "bill", op: "fadeIn", at: 1.0, duration: 0.3 },
                            { target: "bill", op: "scale", at: 1.3, duration: 0.25, to: { scale: 1.25 } },
                            { target: "bill", op: "scale", at: 1.55, duration: 0.35, to: { scale: 1.0 } },
                        ],
                    },
                    {
                        narration: "A committee studies it and writes a recommendation.",
                        audio: P(3),
                        animations: [
                            { target: "stCommittee", op: "fadeIn", at: 0.1, duration: 0.4 },
                            { target: "cComm", op: "drawPath", at: 0.3, duration: 0.4 },
                            { target: "bill", op: "motionPath", path: "billRoute", at: 0.6, duration: 1.0, from: 0, to: 0.25, ease: "power1.inOut" },
                            { target: "stCommittee", op: "highlight", at: 1.7, duration: 0.5, to: { stroke: "#e67e22", fill: "#fff3e0" } },
                        ],
                    },
                    {
                        narration: "Then the full chamber debates and votes.",
                        audio: P(4),
                        animations: [
                            { target: "stDebate", op: "fadeIn", at: 0.1, duration: 0.35 },
                            { target: "cDeb", op: "drawPath", at: 0.25, duration: 0.35 },
                            { target: "bill", op: "motionPath", path: "billRoute", at: 0.45, duration: 0.8, from: 0.25, to: 0.5, ease: "power1.inOut" },
                            { target: "stDebate", op: "highlight", at: 1.25, duration: 0.4, to: { stroke: "#e67e22", fill: "#fff3e0" } },
                            { target: "stVote", op: "fadeIn", at: 0.9, duration: 0.35 },
                            { target: "cVote", op: "drawPath", at: 1.05, duration: 0.35 },
                            { target: "bill", op: "motionPath", path: "billRoute", at: 1.35, duration: 0.8, from: 0.5, to: 0.75, ease: "power1.inOut" },
                            { target: "stVote", op: "highlight", at: 2.2, duration: 0.4, to: { stroke: "#27ae60", fill: "#e8f6ee" } },
                            { target: "voteCheck", op: "drawPath", at: 2.3, duration: 0.5 },
                            { target: "passedLabel", op: "fadeIn", at: 2.5, duration: 0.4 },
                        ],
                    },
                    {
                        narration: "Finally the King formally signs it into law.",
                        audio: P(5),
                        animations: [
                            { target: "stAssent", op: "fadeIn", at: 0.1, duration: 0.4 },
                            { target: "cAss", op: "drawPath", at: 0.3, duration: 0.4 },
                            { target: "bill", op: "motionPath", path: "billRoute", at: 0.6, duration: 0.9, from: 0.75, to: 1.0, ease: "power1.inOut" },
                            { target: "bill", op: "moveTo", at: 1.5, duration: 0.4, to: { x: 621, y: 197 } }, // drops into the box
                            { target: "stAssent", op: "highlight", at: 1.6, duration: 0.5, to: { fill: "#f6d36b", stroke: "#caa23a" } },
                            { target: "stAssent", op: "scale", at: 1.6, duration: 0.5, to: { scale: 1.08 } },
                            { target: "seal", op: "fadeIn", at: 1.7, duration: 0.5 },
                            { target: "signedLabel", op: "fadeIn", at: 2.0, duration: 0.5 },
                        ],
                    },
                ],
            },
        ],
    },

    datastructures: {
        id: "hash-map-vs-b-tree",
        title: "What's the difference between a hash map and a B-tree?",
        background: "#fbfcfe",
        scenes: [
            {
                id: "scene-hash-map",
                background: "#fbfcfe",
                elements: [
                    { id: "hmTitle", type: "text", props: { x: 350, y: 36, text: "Hash map", fill: "#6c3fb0", fontSize: 22, weight: 700, anchor: "middle", opacity: 0 } },

                    // three keys waiting on the left
                    { id: "keys", type: "group", props: { x: 0, y: 0, opacity: 0, children: [
                        { id: "k1", type: "text", props: { x: 60, y: 116, text: "\"cat\"", fill: "#2c3e50", fontSize: 18, weight: 600, opacity: 1 } },
                        { id: "k2", type: "text", props: { x: 60, y: 176, text: "\"dog\"", fill: "#2c3e50", fontSize: 18, weight: 600, opacity: 1 } },
                        { id: "k3", type: "text", props: { x: 60, y: 236, text: "\"fox\"", fill: "#2c3e50", fontSize: 18, weight: 600, opacity: 1 } },
                    ] } },

                    { id: "hashFn", type: "box", props: { x: 196, y: 150, w: 104, h: 54, label: "hash()", fill: "#efe6fb", stroke: "#8e44ad", opacity: 0 } },

                    // five buckets on the right (rect + index, paired)
                    { id: "buckets", type: "group", props: { x: 0, y: 0, opacity: 0, children: [
                        { id: "b0i", type: "text", props: { x: 452, y: 92,  text: "0", fill: "#95a5a6", fontSize: 13, anchor: "middle", opacity: 1 } },
                        { id: "b0",  type: "rect", props: { x: 470, y: 74,  w: 150, h: 30, rx: 5, fill: "#f4f7fa", stroke: "#aab4be", strokeWidth: 1.5, opacity: 1 } },
                        { id: "b1i", type: "text", props: { x: 452, y: 130, text: "1", fill: "#95a5a6", fontSize: 13, anchor: "middle", opacity: 1 } },
                        { id: "b1",  type: "rect", props: { x: 470, y: 112, w: 150, h: 30, rx: 5, fill: "#f4f7fa", stroke: "#aab4be", strokeWidth: 1.5, opacity: 1 } },
                        { id: "b2i", type: "text", props: { x: 452, y: 168, text: "2", fill: "#95a5a6", fontSize: 13, anchor: "middle", opacity: 1 } },
                        { id: "b2",  type: "rect", props: { x: 470, y: 150, w: 150, h: 30, rx: 5, fill: "#f4f7fa", stroke: "#aab4be", strokeWidth: 1.5, opacity: 1 } },
                        { id: "b3i", type: "text", props: { x: 452, y: 206, text: "3", fill: "#95a5a6", fontSize: 13, anchor: "middle", opacity: 1 } },
                        { id: "b3",  type: "rect", props: { x: 470, y: 188, w: 150, h: 30, rx: 5, fill: "#f4f7fa", stroke: "#aab4be", strokeWidth: 1.5, opacity: 1 } },
                        { id: "b4i", type: "text", props: { x: 452, y: 244, text: "4", fill: "#95a5a6", fontSize: 13, anchor: "middle", opacity: 1 } },
                        { id: "b4",  type: "rect", props: { x: 470, y: 226, w: 150, h: 30, rx: 5, fill: "#f4f7fa", stroke: "#aab4be", strokeWidth: 1.5, opacity: 1 } },
                    ] } },

                    // invisible guides: each key scatters to a *different* bucket
                    { id: "rCat", type: "path", props: { d: "M150,128 C320,128 360,89 470,89",  stroke: "transparent", strokeWidth: 0 } },
                    { id: "rDog", type: "path", props: { d: "M150,170 C320,170 360,203 470,203", stroke: "transparent", strokeWidth: 0 } },
                    { id: "rFox", type: "path", props: { d: "M150,230 C320,230 360,127 470,127", stroke: "transparent", strokeWidth: 0 } },

                    // travelling key dots
                    { id: "pCat", type: "circle", props: { x: 150, y: 128, r: 8, fill: "#8e44ad", opacity: 0 } },
                    { id: "pDog", type: "circle", props: { x: 150, y: 170, r: 8, fill: "#8e44ad", opacity: 0 } },
                    { id: "pFox", type: "circle", props: { x: 150, y: 230, r: 8, fill: "#8e44ad", opacity: 0 } },

                    { id: "hmVerdict", type: "text", props: { x: 350, y: 318, text: "O(1) lookup · no order", fill: "#6c3fb0", fontSize: 16, weight: 600, anchor: "middle", opacity: 0 } },
                ],
                beats: [
                    {
                        narration: "A hash map turns each key into a number with a hash function.",
                        audio: D(0),
                        animations: [
                            { target: "hmTitle", op: "fadeIn", at: 0.1, duration: 0.4 },
                            { target: "keys", op: "fadeIn", at: 0.3, duration: 0.5, stagger: 0.15 },
                            { target: "hashFn", op: "fadeIn", at: 1.0, duration: 0.5 },
                            { target: "hashFn", op: "scale", at: 1.6, duration: 0.5, to: { scale: 1.08 } },
                        ],
                    },
                    {
                        narration: "That number points straight to the bucket holding the value.",
                        audio: D(1),
                        animations: [
                            { target: "buckets", op: "fadeIn", at: 0.1, duration: 0.5 },
                            // each key fires through hash() into its own bucket
                            { target: "pCat", op: "fadeIn", at: 0.5, duration: 0.2 },
                            { target: "pCat", op: "motionPath", path: "rCat", at: 0.7, duration: 0.9, from: 0, to: 1, ease: "power1.inOut" },
                            { target: "b0", op: "highlight", at: 1.55, duration: 0.4, to: { fill: "#e9dcfa", stroke: "#8e44ad" } },
                            { target: "pDog", op: "fadeIn", at: 0.9, duration: 0.2 },
                            { target: "pDog", op: "motionPath", path: "rDog", at: 1.1, duration: 0.9, from: 0, to: 1, ease: "power1.inOut" },
                            { target: "b3", op: "highlight", at: 1.95, duration: 0.4, to: { fill: "#e9dcfa", stroke: "#8e44ad" } },
                            { target: "pFox", op: "fadeIn", at: 1.3, duration: 0.2 },
                            { target: "pFox", op: "motionPath", path: "rFox", at: 1.5, duration: 0.9, from: 0, to: 1, ease: "power1.inOut" },
                            { target: "b1", op: "highlight", at: 2.35, duration: 0.4, to: { fill: "#e9dcfa", stroke: "#8e44ad" } },
                        ],
                    },
                    {
                        narration: "So lookups are nearly instant, but the keys stay unordered.",
                        audio: D(2),
                        animations: [
                            // pulse the filled buckets — note they landed at 0, 3, 1: no order
                            { target: "b0", op: "scale", at: 0.2, duration: 0.4, to: { scale: 1.05 } },
                            { target: "b3", op: "scale", at: 0.45, duration: 0.4, to: { scale: 1.05 } },
                            { target: "b1", op: "scale", at: 0.7, duration: 0.4, to: { scale: 1.05 } },
                            { target: "hmVerdict", op: "fadeIn", at: 1.1, duration: 0.6 },
                        ],
                    },
                ],
            },
            {
                id: "scene-b-tree",
                background: "#fbfcfe",
                elements: [
                    { id: "btTitle", type: "text", props: { x: 350, y: 36, text: "B-tree", fill: "#1d8a5f", fontSize: 22, weight: 700, anchor: "middle", opacity: 0 } },

                    { id: "root", type: "box", props: { x: 280, y: 64, w: 140, h: 46, label: "30 | 60", fill: "#e8f6ef", stroke: "#27ae60", opacity: 0 } },

                    // edges drawn before leaves so they sit behind
                    { id: "e1", type: "path", props: { d: "M310,110 C250,150 175,158 165,182", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },
                    { id: "e2", type: "path", props: { d: "M350,110 L350,182", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },
                    { id: "e3", type: "path", props: { d: "M390,110 C450,150 525,158 535,182", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },

                    { id: "leaves", type: "group", props: { x: 0, y: 0, opacity: 0, children: [
                        { id: "n1", type: "box", props: { x: 110, y: 184, w: 110, h: 42, label: "10 | 20", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
                        { id: "n2", type: "box", props: { x: 295, y: 184, w: 110, h: 42, label: "40 | 50", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
                        { id: "n3", type: "box", props: { x: 480, y: 184, w: 110, h: 42, label: "70 | 80", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
                    ] } },

                    // search target + descent probe
                    { id: "target", type: "text", props: { x: 350, y: 134, text: "find 70", fill: "#e67e22", fontSize: 15, weight: 700, anchor: "middle", opacity: 0 } },
                    { id: "probePath", type: "path", props: { d: "M350,60 C350,110 470,150 535,182", stroke: "transparent", strokeWidth: 0 } },
                    { id: "probe", type: "circle", props: { x: 350, y: 60, r: 9, fill: "#e67e22", glow: true, opacity: 0 } },

                    // range-scan sweep across the sorted leaves
                    { id: "scanBar", type: "rect", props: { x: 110, y: 246, w: 6, h: 8, rx: 3, fill: "#2980b9", opacity: 0 } },
                    { id: "btVerdict", type: "text", props: { x: 350, y: 322, text: "O(log n) lookup · sorted ranges free", fill: "#1d8a5f", fontSize: 16, weight: 600, anchor: "middle", opacity: 0 } },
                ],
                beats: [
                    {
                        narration: "A B-tree keeps its keys sorted inside linked nodes.",
                        audio: D(3),
                        animations: [
                            { target: "btTitle", op: "fadeIn", at: 0.1, duration: 0.4 },
                            { target: "root", op: "fadeIn", at: 0.4, duration: 0.5 },
                            { target: "leaves", op: "fadeIn", at: 0.9, duration: 0.6, stagger: 0.12 },
                            { target: "e1", op: "drawPath", at: 1.1, duration: 0.5 },
                            { target: "e2", op: "drawPath", at: 1.25, duration: 0.5 },
                            { target: "e3", op: "drawPath", at: 1.4, duration: 0.5 },
                        ],
                    },
                    {
                        narration: "To find a key, you walk down from the root, comparing as you go.",
                        audio: D(4),
                        animations: [
                            { target: "target", op: "fadeIn", at: 0.2, duration: 0.4 },
                            { target: "probe", op: "fadeIn", at: 0.5, duration: 0.3 },
                            { target: "root", op: "highlight", at: 0.7, duration: 0.4, to: { stroke: "#e67e22", fill: "#fdf3e0" } },
                            // 70 > 60, so descend right — the probe rides to n3
                            { target: "probe", op: "motionPath", path: "probePath", at: 1.1, duration: 1.3, from: 0, to: 1, ease: "power2.inOut" },
                            { target: "n3", op: "highlight", at: 2.5, duration: 0.5, to: { stroke: "#e67e22", fill: "#fdf3e0" } },
                        ],
                    },
                    {
                        narration: "It's a little slower, but ranges and ordered scans come for free.",
                        audio: D(5),
                        animations: [
                            // a single sweep bar grows across all three sorted leaves, in order
                            { target: "scanBar", op: "fadeIn", at: 0.2, duration: 0.3 },
                            { target: "scanBar", op: "morph", at: 0.5, duration: 1.6, to: { d: "M110,246 L590,246 L590,254 L110,254 Z" }, ease: "power1.inOut" },
                            { target: "n1", op: "highlight", at: 0.7, duration: 0.4, to: { stroke: "#2980b9", fill: "#e7f0fb" } },
                            { target: "n2", op: "highlight", at: 1.2, duration: 0.4, to: { stroke: "#2980b9", fill: "#e7f0fb" } },
                            { target: "n3", op: "highlight", at: 1.7, duration: 0.4, to: { stroke: "#2980b9", fill: "#e7f0fb" } },
                            { target: "btVerdict", op: "fadeIn", at: 2.1, duration: 0.6 },
                        ],
                    },
                ],
            },
        ],
    },

};

export { MOCK }
