export const ELEMENT_TYPES = [
  "circle",     // sun, parliament seats, dots
  "rect",       // hash-map buckets, array cells, spectrum bands, bars
  "path",       // light rays, bill-flow route, B-tree edges
  "arrow",      // connector with an arrowhead (stage-to-stage, hash pointer)
  "text",       // labels, keys, stage names, counters
  "box",        // labeled rectangle (rect + text): parliament stages, B-tree nodes
  "group",      // container moved/faded as one: the array, seat cluster, whole tree
  "particles",  // air-molecule field (tsParticles)
  "arc",        // NEW — d3-shape wedge: hemicycle seating, pie/donut, count segments
  "axis",       // NEW — d3-axis + d3-scale: ticked axis for charts/timelines (pairs w/ rect/circle)
  "graph",      // NEW — nodes + edges auto-laid-out by elkjs: trees, flows, pointer chains
] as const;

export const OPS = [
  "fadeIn",     // reveal (opacity 0 -> 1)
  "fadeOut",    // hide
  "moveTo",     // tween geometry/transform to a position
  "scale",      // grow/shrink for emphasis (pulse a node, zoom a bucket)
  "drawPath",   // progressively draw a stroke in (core GSAP, stroke-dasharray)
  "motionPath", // move along a guide path (core GSAP, getPointAtLength sampling)
  "morph",      // shape A -> shape B; SAME command-structure only w/o MorphSVG plugin
  "highlight",  // change fill/stroke/color to emphasize
  "countTo",    // NEW — tween a numeric text value (counters: "7 wars", tallies, %)
] as const;

export type ElementType = (typeof ELEMENT_TYPES)[number];
export type Op = (typeof OPS)[number];
