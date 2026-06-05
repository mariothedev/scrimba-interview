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
