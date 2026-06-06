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

  // nature: {
  //   id: "why-is-the-sky-blue",
  //   title: "Why is the sky blue?",
  //   scenes: [
  //     {
  //       id: "scene-sunlight",
  //       background: "blue",
  //       elements: [
  //         { id: "sun", type: "circle", props: { x: 110, y: 90, r: 44, fill: "#fff3b0", opacity: 0 } },
  //         { id: "ray", type: "path", props: { d: "M150,90 L620,300", stroke: "#ffffff", strokeWidth: 4, draw: 0 } },
  //       ],
  //       beats: [
  //         {
  //           narration: "Sunlight looks white.",
  //           audio: N(0),
  //           animations: [
  //             { target: "sun", op: "fadeIn", at: 0.2, duration: 0.6 },
  //             { target: "ray", op: "drawPath", at: 0.9, duration: 1.0 },
  //           ],
  //         },
  //         {
  //           narration: "But it's really a mix of every color.",
  //           audio: N(1),
  //           animations: [
  //             { target: "ray", op: "highlight", at: 0.4, duration: 1.0, to: { stroke: "#7cc0ff" } },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       id: "scene-scattering",
  //       background: "#ffffff",
  //       elements: [
  //         { id: "molecules", type: "particles", props: { count: 60, color: "#9fd3ff", opacity: 0 } },
  //         { id: "blueRay", type: "path", props: { d: "M40,260 L640,260", stroke: "#cfe8ff", strokeWidth: 4 } },
  //       ],
  //       beats: [
  //         {
  //           narration: "The air is full of tiny molecules.",
  //           audio: N(2),
  //           animations: [
  //             { target: "molecules", op: "fadeIn", at: 0.1, duration: 0.7 },
  //           ],
  //         },
  //         {
  //           narration: "Blue light scatters off them, so the whole sky glows blue.",
  //           audio: N(3),
  //           animations: [
  //             { target: "blueRay", op: "highlight", at: 0.5, duration: 0.6, to: { stroke: "#2f7bff" } },
  //             { target: "molecules", op: "highlight", at: 0.5, duration: 0.6, to: { color: "#2f7bff" } },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

  politics: {
    id: "how-norway-parliament-works",
    title: "How does the Norwegian parliament work?",
    scenes: [
      {
        id: "scene-storting",
        background: "#ffffff",
        elements: [
          { id: "stortingLabel", type: "text", props: { x: 340, y: 48, text: "Stortinget", fill: "#1f2d3d", fontSize: 26, anchor: "middle", opacity: 0 } },
          {
            id: "seats",
            type: "group",
            props: {
              x: 0,
              y: 0,
              opacity: 0,
              children: [
                { id: "s1", type: "circle", props: { x: 190, y: 215, r: 12, fill: "#c0392b", opacity: 1 } },
                { id: "s2", type: "circle", props: { x: 217, y: 167, r: 12, fill: "#c0392b", opacity: 1 } },
                { id: "s3", type: "circle", props: { x: 260, y: 131, r: 12, fill: "#e67e22", opacity: 1 } },
                { id: "s4", type: "circle", props: { x: 312, y: 112, r: 12, fill: "#e67e22", opacity: 1 } },
                { id: "s5", type: "circle", props: { x: 368, y: 112, r: 12, fill: "#27ae60", opacity: 1 } },
                { id: "s6", type: "circle", props: { x: 420, y: 131, r: 12, fill: "#2980b9", opacity: 1 } },
                { id: "s7", type: "circle", props: { x: 463, y: 167, r: 12, fill: "#2980b9", opacity: 1 } },
                { id: "s8", type: "circle", props: { x: 490, y: 215, r: 12, fill: "#2c3e50", opacity: 1 } },
                { id: "s9", type: "circle", props: { x: 245, y: 215, r: 12, fill: "#c0392b", opacity: 1 } },
                { id: "s10", type: "circle", props: { x: 269, y: 186, r: 12, fill: "#e67e22", opacity: 1 } },
                { id: "s11", type: "circle", props: { x: 302, y: 167, r: 12, fill: "#e67e22", opacity: 1 } },
                { id: "s12", type: "circle", props: { x: 340, y: 160, r: 12, fill: "#27ae60", opacity: 1 } },
                { id: "s13", type: "circle", props: { x: 378, y: 167, r: 12, fill: "#2980b9", opacity: 1 } },
                { id: "s14", type: "circle", props: { x: 411, y: 186, r: 12, fill: "#2980b9", opacity: 1 } },
                { id: "s15", type: "circle", props: { x: 435, y: 215, r: 12, fill: "#2c3e50", opacity: 1 } },
              ],
            },
          },
          { id: "seatCount", type: "text", props: { x: 340, y: 300, text: "169 seats · elected every 4 years", fill: "#5a6b7b", fontSize: 16, anchor: "middle", opacity: 0 } },
        ],
        beats: [
          {
            narration: "Norway's parliament is called the Storting.",
            audio: P(0),
            animations: [
              { target: "stortingLabel", op: "fadeIn", at: 0.1, duration: 0.5 },
              { target: "seats", op: "fadeIn", at: 0.5, duration: 0.8 },
            ],
          },
          {
            narration: "Its 169 representatives are elected every four years.",
            audio: P(1),
            animations: [
              { target: "seatCount", op: "fadeIn", at: 0.2, duration: 0.6 },
              { target: "seats", op: "scale", at: 0.6, duration: 0.6, to: { scale: 1.04 } },
            ],
          },
        ],
      },
      {
        id: "scene-how-a-law-passes",
        background: "#ffffff",
        elements: [
          { id: "stProposal", type: "box", props: { x: 24, y: 170, w: 104, h: 54, label: "Proposal", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
          { id: "stCommittee", type: "box", props: { x: 160, y: 170, w: 104, h: 54, label: "Committee", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
          { id: "stDebate", type: "box", props: { x: 296, y: 170, w: 104, h: 54, label: "Debate", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
          { id: "stVote", type: "box", props: { x: 432, y: 170, w: 104, h: 54, label: "Vote", fill: "#eaf2fb", stroke: "#2980b9", opacity: 0 } },
          { id: "stAssent", type: "box", props: { x: 568, y: 170, w: 108, h: 54, label: "Royal Assent", fill: "#fdf3da", stroke: "#caa23a", opacity: 0 } },
          { id: "aPC", type: "arrow", props: { x1: 130, y1: 197, x2: 158, y2: 197, stroke: "#90a4b5", strokeWidth: 3, draw: 0 } },
          { id: "aCD", type: "arrow", props: { x1: 266, y1: 197, x2: 294, y2: 197, stroke: "#90a4b5", strokeWidth: 3, draw: 0 } },
          { id: "aDV", type: "arrow", props: { x1: 402, y1: 197, x2: 430, y2: 197, stroke: "#90a4b5", strokeWidth: 3, draw: 0 } },
          { id: "aVA", type: "arrow", props: { x1: 538, y1: 197, x2: 566, y2: 197, stroke: "#90a4b5", strokeWidth: 3, draw: 0 } },
          { id: "billRoute", type: "path", props: { d: "M76,197 L622,197", stroke: "transparent", strokeWidth: 0, draw: 0 } },
          { id: "bill", type: "circle", props: { x: 76, y: 197, r: 13, fill: "#f1c40f", opacity: 0 } },
        ],
        beats: [
          {
            narration: "Anyone in the Storting can propose a new bill.",
            audio: P(2),
            animations: [
              { target: "stProposal", op: "fadeIn", at: 0.1, duration: 0.5 },
              { target: "bill", op: "fadeIn", at: 0.5, duration: 0.4 },
              { target: "bill", op: "scale", at: 0.9, duration: 0.4, to: { scale: 1.2 } },
            ],
          },
          {
            narration: "A committee studies it and writes a recommendation.",
            audio: P(3),
            animations: [
              { target: "stCommittee", op: "fadeIn", at: 0.1, duration: 0.4 },
              { target: "aPC", op: "drawPath", at: 0.2, duration: 0.5 },
              { target: "bill", op: "motionPath", at: 0.6, duration: 0.9, path: "billRoute", from: 0, to: 0.25 },
              { target: "stCommittee", op: "highlight", at: 1.4, duration: 0.5, to: { stroke: "#f39c12" } },
            ],
          },
          {
            narration: "Then the full chamber debates and votes.",
            audio: P(4),
            animations: [
              { target: "stDebate", op: "fadeIn", at: 0.1, duration: 0.4 },
              { target: "aCD", op: "drawPath", at: 0.2, duration: 0.4 },
              { target: "stVote", op: "fadeIn", at: 0.5, duration: 0.4 },
              { target: "aDV", op: "drawPath", at: 0.6, duration: 0.4 },
              { target: "bill", op: "motionPath", at: 0.8, duration: 1.0, path: "billRoute", from: 0.25, to: 0.75 },
              { target: "stVote", op: "highlight", at: 1.8, duration: 0.4, to: { stroke: "#f39c12" } },
            ],
          },
          {
            narration: "Finally the King formally signs it into law.",
            audio: P(5),
            animations: [
              { target: "stAssent", op: "fadeIn", at: 0.1, duration: 0.4 },
              { target: "aVA", op: "drawPath", at: 0.2, duration: 0.4 },
              { target: "bill", op: "motionPath", at: 0.6, duration: 0.9, path: "billRoute", from: 0.75, to: 1 },
              { target: "stAssent", op: "highlight", at: 1.5, duration: 0.6, to: { fill: "#f6d36b" } },
              { target: "stAssent", op: "scale", at: 1.5, duration: 0.6, to: { scale: 1.08 } },
            ],
          },
        ],
      },
    ],
  },

  datastructures: {
    id: "hash-map-vs-b-tree",
    title: "What's the difference between a hash map and a B-tree?",
    scenes: [
      {
        id: "scene-hash-map",
        background: "#ffffff",
        elements: [
          {
            id: "keys",
            type: "group",
            props: {
              x: 0,
              y: 0,
              opacity: 0,
              children: [
                { id: "k1", type: "text", props: { x: 56, y: 120, text: "\"cat\"", fill: "#2c3e50", fontSize: 18, opacity: 1 } },
                { id: "k2", type: "text", props: { x: 56, y: 170, text: "\"dog\"", fill: "#2c3e50", fontSize: 18, opacity: 1 } },
                { id: "k3", type: "text", props: { x: 56, y: 220, text: "\"fox\"", fill: "#2c3e50", fontSize: 18, opacity: 1 } },
              ],
            },
          },
          { id: "hashFn", type: "box", props: { x: 200, y: 150, w: 96, h: 54, label: "hash()", fill: "#efe6fb", stroke: "#8e44ad", opacity: 0 } },
          {
            id: "buckets",
            type: "group",
            props: {
              x: 0,
              y: 0,
              opacity: 0,
              children: [
                { id: "b0", type: "rect", props: { x: 470, y: 70, w: 150, h: 34, fill: "#f4f7fa", stroke: "#7f8c8d", opacity: 1 } },
                { id: "b0i", type: "text", props: { x: 452, y: 92, text: "0", fill: "#95a5a6", fontSize: 14, opacity: 1 } },
                { id: "b1", type: "rect", props: { x: 470, y: 110, w: 150, h: 34, fill: "#f4f7fa", stroke: "#7f8c8d", opacity: 1 } },
                { id: "b1i", type: "text", props: { x: 452, y: 132, text: "1", fill: "#95a5a6", fontSize: 14, opacity: 1 } },
                { id: "b2", type: "rect", props: { x: 470, y: 150, w: 150, h: 34, fill: "#f4f7fa", stroke: "#7f8c8d", opacity: 1 } },
                { id: "b2i", type: "text", props: { x: 452, y: 172, text: "2", fill: "#95a5a6", fontSize: 14, opacity: 1 } },
                { id: "b3", type: "rect", props: { x: 470, y: 190, w: 150, h: 34, fill: "#f4f7fa", stroke: "#7f8c8d", opacity: 1 } },
                { id: "b3i", type: "text", props: { x: 452, y: 212, text: "3", fill: "#95a5a6", fontSize: 14, opacity: 1 } },
                { id: "b4", type: "rect", props: { x: 470, y: 230, w: 150, h: 34, fill: "#f4f7fa", stroke: "#7f8c8d", opacity: 1 } },
                { id: "b4i", type: "text", props: { x: 452, y: 252, text: "4", fill: "#95a5a6", fontSize: 14, opacity: 1 } },
              ],
            },
          },
          { id: "hashRoute", type: "path", props: { d: "M296,177 C390,177 400,167 470,167", stroke: "#b39ddb", strokeWidth: 3, draw: 0 } },
          { id: "hkey", type: "circle", props: { x: 80, y: 165, r: 11, fill: "#8e44ad", opacity: 0 } },
        ],
        beats: [
          {
            narration: "A hash map turns each key into a number with a hash function.",
            audio: D(0),
            animations: [
              { target: "keys", op: "fadeIn", at: 0.2, duration: 0.6 },
              { target: "hashFn", op: "fadeIn", at: 0.7, duration: 0.5 },
              { target: "hashFn", op: "scale", at: 1.3, duration: 0.5, to: { scale: 1.08 } },
            ],
          },
          {
            narration: "That number points straight to the bucket holding the value.",
            audio: D(1),
            animations: [
              { target: "buckets", op: "fadeIn", at: 0.1, duration: 0.6 },
              { target: "hkey", op: "fadeIn", at: 0.4, duration: 0.3 },
              { target: "hkey", op: "moveTo", at: 0.7, duration: 0.6, to: { x: 248, y: 177 } },
              { target: "hashRoute", op: "drawPath", at: 1.3, duration: 0.5 },
              { target: "hkey", op: "motionPath", at: 1.6, duration: 0.9, path: "hashRoute", from: 0, to: 1 },
              { target: "b2", op: "highlight", at: 2.4, duration: 0.5, to: { fill: "#d7c4f0", stroke: "#8e44ad" } },
            ],
          },
          {
            narration: "So lookups are nearly instant, but the keys stay unordered.",
            audio: D(2),
            animations: [
              { target: "buckets", op: "highlight", at: 0.2, duration: 0.7, to: { stroke: "#8e44ad" } },
              { target: "b2", op: "scale", at: 0.4, duration: 0.4, to: { scale: 1.06 } },
              { target: "hkey", op: "fadeOut", at: 1.0, duration: 0.5 },
            ],
          },
        ],
      },
      {
        id: "scene-b-tree",
        background: "#ffffff",
        elements: [
          { id: "root", type: "box", props: { x: 240, y: 54, w: 140, h: 46, label: "30 | 60", fill: "#e8f6ef", stroke: "#27ae60", opacity: 0 } },
          {
            id: "leaves",
            type: "group",
            props: {
              x: 0,
              y: 0,
              opacity: 0,
              children: [
                { id: "n1", type: "box", props: { x: 90, y: 180, w: 110, h: 42, label: "10 | 20", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
                { id: "n2", type: "box", props: { x: 255, y: 180, w: 110, h: 42, label: "40 | 50", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
                { id: "n3", type: "box", props: { x: 420, y: 180, w: 110, h: 42, label: "70 | 80", fill: "#eafaf1", stroke: "#27ae60", opacity: 1 } },
              ],
            },
          },
          { id: "e1", type: "path", props: { d: "M310,100 C250,140 160,150 145,180", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },
          { id: "e2", type: "path", props: { d: "M310,100 L310,180", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },
          { id: "e3", type: "path", props: { d: "M310,100 C370,140 460,150 475,180", stroke: "#9bd3b4", strokeWidth: 3, draw: 0 } },
          { id: "probePath", type: "path", props: { d: "M310,77 C380,130 470,150 475,201", stroke: "transparent", strokeWidth: 0, draw: 0 } },
          { id: "probe", type: "circle", props: { x: 310, y: 77, r: 10, fill: "#16a085", opacity: 0 } },
          { id: "scanBar", type: "path", props: { d: "M90,234 L200,234", stroke: "#27ae60", strokeWidth: 4, opacity: 0 } },
        ],
        beats: [
          {
            narration: "A B-tree keeps its keys sorted inside linked nodes.",
            audio: D(3),
            animations: [
              { target: "root", op: "fadeIn", at: 0.1, duration: 0.5 },
              { target: "leaves", op: "fadeIn", at: 0.5, duration: 0.6 },
              { target: "e1", op: "drawPath", at: 0.7, duration: 0.5 },
              { target: "e2", op: "drawPath", at: 0.8, duration: 0.5 },
              { target: "e3", op: "drawPath", at: 0.9, duration: 0.5 },
            ],
          },
          {
            narration: "To find a key, you walk down from the root, comparing as you go.",
            audio: D(4),
            animations: [
              { target: "probe", op: "fadeIn", at: 0.2, duration: 0.3 },
              { target: "root", op: "highlight", at: 0.4, duration: 0.4, to: { stroke: "#f39c12" } },
              { target: "probe", op: "motionPath", at: 0.8, duration: 1.1, path: "probePath", from: 0, to: 1 },
              { target: "n3", op: "highlight", at: 2.0, duration: 0.5, to: { stroke: "#f39c12", fill: "#fdf3da" } },
            ],
          },
          {
            narration: "It's a little slower, but ranges and ordered scans come for free.",
            audio: D(5),
            animations: [
              { target: "scanBar", op: "fadeIn", at: 0.2, duration: 0.3 },
              { target: "scanBar", op: "morph", at: 0.5, duration: 1.2, to: { d: "M90,234 L530,234" } },
              { target: "n1", op: "highlight", at: 0.6, duration: 0.4, to: { stroke: "#2980b9" } },
              { target: "n2", op: "highlight", at: 1.0, duration: 0.4, to: { stroke: "#2980b9" } },
              { target: "n3", op: "highlight", at: 1.4, duration: 0.4, to: { stroke: "#2980b9" } },
              { target: "leaves", op: "scale", at: 1.4, duration: 0.5, to: { scale: 1.03 } },
            ],
          },
        ],
      },
    ],
  },
};

export { MOCK }
