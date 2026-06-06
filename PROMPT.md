You're a front-end developer who specializes in creating fun, engaging lessons in the browser. Your task is to create a mocked response that utilizes the following libraries to create a short
lesson on the following topic in the browser.

# CURRENT MOCKED RESPONSE
```
const durations = (n: number) => ({
 0: 2,
 1: 2,
 2: 2,
 3: 4
});

const A = (n: number) => ({
    url: `https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/why-is-the-sky-blue/${n}.mp3`,
    duration: durations(n)
});

const MOCK: Record<string, unknown> = {
  nature: {
    id: "why-is-the-sky-blue",
    title: "Why is the sky blue?",
    scenes: [
      {
        id: "scene-sunlight",
        elements: [
          { id: "sun", type: "circle", props: { x: 110, y: 90, r: 44, fill: "#fff3b0", opacity: 0 } },
          { id: "ray", type: "path", props: { d: "M150,90 L620,300", stroke: "#ffffff", strokeWidth: 4, draw: 0 } },
        ],
        beats: [
          {
            narration: "Sunlight looks white.",
            audio: A(0),
            animations: [
              { target: "sun", op: "fadeIn", at: 0.2, duration: 0.6 },
              { target: "ray", op: "drawPath", at: 0.9, duration: 1.0 },
            ],
          },
          {
            narration: "But it's really a mix of every color.",
            audio: A(1),
            animations: [
              { target: "ray", op: "highlight", at: 0.4, duration: 1.0, to: { stroke: "#7cc0ff" } },
            ],
          },
        ],
      },
      {
        id: "scene-scattering",
        elements: [
          { id: "molecules", type: "particles", props: { count: 60, color: "#9fd3ff", opacity: 0 } },
          { id: "blueRay", type: "path", props: { d: "M40,260 L640,260", stroke: "#cfe8ff", strokeWidth: 4 } },
        ],
        beats: [
          {
            narration: "The air is full of tiny molecules.",
            audio: A(2),
            animations: [
              { target: "molecules", op: "fadeIn", at: 0.1, duration: 0.7 },
            ],
          },
          {
            narration: "Blue light scatters off them, so the whole sky glows blue.",
            audio: A(3),
            animations: [
              { target: "blueRay", op: "highlight", at: 0.5, duration: 0.6, to: { stroke: "#2f7bff" } },
              { target: "molecules", op: "highlight", at: 0.5, duration: 0.6, to: { color: "#2f7bff" } },
            ],
          },
        ],
      },
    ],
  },
};

export { MOCK }
```

# THE ELEMENTS TO USE (WHEN APPLICABLE)
```
export const ELEMENT_TYPES = [
  "circle",     // sun, parliament seats, dots
  "rect",       // hash-map buckets, array cells, spectrum bands
  "path",       // light rays, bill-flow route, B-tree edges
  "arrow",      // connector with an arrowhead (stage-to-stage, hash pointer)
  "text",       // labels, keys, stage names
  "box",        // labeled rectangle (rect + text): parliament stages, B-tree nodes
  "group",      // container moved/faded as one: the array, seat cluster, whole tree
  "particles",  // air-molecule field (tsParticles)
] as const;

export const OPS = [
  "fadeIn",     // reveal (opacity 0 -> 1)
  "fadeOut",    // hide
  "moveTo",     // translate to a position
  "scale",      // grow/shrink for emphasis (pulse a node, zoom a bucket)
  "drawPath",   // DrawSVG: progressively draw a stroke in
  "motionPath", // MotionPath: move along a path (token, lookup probe, key into bucket)
  "morph",      // MorphSVG: shape A -> shape B (white ray -> spectrum fan)
  "highlight",  // change fill/stroke/color to emphasize
] as const;

export type ElementType = (typeof ELEMENT_TYPES)[number];
export type Op = (typeof OPS)[number];
```

# LIBRARIES TO USE
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>                                  
        <script src="https://cdn.jsdelivr.net/npm/@tsparticles/slim@3/tsparticles.slim.bundle.min.js"></script>   
        <script src="https://cdn.jsdelivr.net/npm/elkjs@0/lib/elk.bundled.js"></script>                           
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="main.js"></script>
    </body>
</html>
```

# BACKGROUND ON TASK ITSELF (FOR CONTEXT ONLY)

## Task
```
AI-generated educational lessons that are rendered in the browser
Build a service that takes an educational query (e.g. "why is the
sky blue?") and returns an animated visual explanation with narration
that plays in a web browser (so i.e. DOM/SVG/Canvas, not mp4).
```
## Specs
```
Spec.
Script: AI-generated.
Visuals: AI-generated, rendered in the browser as vectors / DOM
(i.e. SVG, HTML/CSS, Canvas with shapes, WebGL). No MP4 or rasterized
video output. No Sora, Veo, Runway, or Pika.
Audio: AI-generated narration (TTS).
Output surface: the browser. Whatever the user lands on, they see and hear the explanation play live.
```
## Scenario
```
Works for these three queries :
* Why is the sky blue?
* How does the Norwegian parliament work?
* What's the difference between a hash map and a B-tree?
```

Important: we are only looking for the mocked response for now. So you should only respond with MOCK object. Avoid explanations, just respond with code.
Also, these audio files actually map to the content in the current lesson:
```
const durations = (n: number) => ({
 0: 2,
 1: 2,
 2: 2,
 3: 4
});

const A = (n: number) => ({
    url: `https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/why-is-the-sky-blue/${n}.mp3`,
    duration: durations(n)
});
```

Ex: 0.mp3 actually says "Sunlight looks white."

Keep this content. I'm more concerned with elements and animations we use.
