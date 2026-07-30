export const presets = {
  roof: [{ type: "cube", size: [4, 0.2, 4], pos: [0, 3, 0] }],
  wall: [{ type: "cube", size: [1, 2, 0.2], pos: [0, 1, 0] }],
  pillar: [{ type: "cube", size: [0.3, 3, 0.3], pos: [0, 1.5, 0] }],
  house: [
  // Foundation
  { type: "cube", size: [8, 0.4, 8], pos: [0, -0.2, 0] },

  // Floor
  { type: "cube", size: [7.6, 0.2, 7.6], pos: [0, 0.1, 0] },

  // =====================
  // Walls
  // =====================
  { type: "cube", size: [8, 3, 0.2], pos: [0, 1.5, -4] },   // Back
  { type: "cube", size: [8, 3, 0.2], pos: [0, 1.5, 4] },    // Front top
  { type: "cube", size: [0.2, 3, 8], pos: [-4, 1.5, 0] },   // Left
  { type: "cube", size: [0.2, 3, 8], pos: [4, 1.5, 0] },    // Right

  // Door frame
  { type: "cube", size: [2.8, 1, 0.2], pos: [0, 2.5, 4] },
  { type: "cube", size: [0.2, 2, 0.2], pos: [-1.4, 1, 4] },
  { type: "cube", size: [0.2, 2, 0.2], pos: [1.4, 1, 4] },

  // =====================
  // Roof
  // =====================
  {
    type: "cube",
    size: [8.6, 0.25, 4.6],
    pos: [0, 3.6, -1.2],
    rot: [25, 0, 0]
  },
  {
    type: "cube",
    size: [8.6, 0.25, 4.6],
    pos: [0, 3.6, 1.2],
    rot: [-25, 0, 0]
  },

  // Roof ridge
  { type: "cube", size: [8.2, 0.2, 0.25], pos: [0, 4.45, 0] },

  // =====================
  // Porch
  // =====================
  { type: "cube", size: [3, 0.2, 2], pos: [0, 0.1, 5] },
  { type: "cube", size: [3.2, 0.2, 2.2], pos: [0, 2.7, 5] },

  // Porch pillars
  { type: "cube", size: [0.2, 2.6, 0.2], pos: [-1.3, 1.3, 6] },
  { type: "cube", size: [0.2, 2.6, 0.2], pos: [1.3, 1.3, 6] },

  // =====================
  // Corner pillars
  // =====================
  { type: "cube", size: [0.3, 3, 0.3], pos: [-4, 1.5, -4] },
  { type: "cube", size: [0.3, 3, 0.3], pos: [4, 1.5, -4] },
  { type: "cube", size: [0.3, 3, 0.3], pos: [-4, 1.5, 4] },
  { type: "cube", size: [0.3, 3, 0.3], pos: [4, 1.5, 4] },

  // =====================
  // Windows
  // =====================
  { type: "cube", size: [1.2, 1.2, 0.1], pos: [-2.3, 1.8, 4.01] },
  { type: "cube", size: [1.2, 1.2, 0.1], pos: [2.3, 1.8, 4.01] },

  { type: "cube", size: [0.1, 1.2, 1.2], pos: [-4.01, 1.8, -2] },
  { type: "cube", size: [0.1, 1.2, 1.2], pos: [-4.01, 1.8, 2] },

  { type: "cube", size: [0.1, 1.2, 1.2], pos: [4.01, 1.8, -2] },
  { type: "cube", size: [0.1, 1.2, 1.2], pos: [4.01, 1.8, 2] },

  // =====================
  // Chimney
  // =====================
  { type: "cube", size: [0.8, 2, 0.8], pos: [-2.8, 4.6, -1] },
]
};