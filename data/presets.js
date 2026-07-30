export const presets = {
  roof: [{ type: "cube", size: [4, 0.2, 4], pos: [0, 3, 0] }],
  wall: [{ type: "cube", size: [1, 2, 0.2], pos: [0, 1, 0] }],
  pillar: [{ type: "cube", size: [0.3, 3, 0.3], pos: [0, 1.5, 0] }],
  
  house: [
    {
      "type": "cube",
      "size": [16, 0.5, 16],
      "pos": [0, -0.25, 0],
      "color": "#6d4c41",
      "roughness": 1
    },

    {
      "type": "cube",
      "size": [12, 0.3, 12],
      "pos": [0, 0.15, 0],
      "color": "#c8b08a",
      "roughness": 0.9
    },

    {
      "type": "cube",
      "size": [12, 4, 0.3],
      "pos": [0, 2, -6],
      "color": "#ece7dc"
    },
    {
      "type": "cube",
      "size": [12, 4, 0.3],
      "pos": [0, 2, 6],
      "color": "#ece7dc"
    },
    {
      "type": "cube",
      "size": [0.3, 4, 12],
      "pos": [-6, 2, 0],
      "color": "#ece7dc"
    },
    {
      "type": "cube",
      "size": [0.3, 4, 12],
      "pos": [6, 2, 0],
      "color": "#ece7dc"
    },

    {
      "type": "cube",
      "size": [4, 0.25, 3],
      "pos": [0, 2.6, 6.2],
      "color": "#5d4037"
    },

    {
      "type": "cube",
      "size": [3.5, 0.25, 2.8],
      "pos": [0, 5.2, 0],
      "rotation": [0.55, 0, 0],
      "color": "#8d6e63"
    },
    {
      "type": "cube",
      "size": [3.5, 0.25, 2.8],
      "pos": [0, 5.2, 0],
      "rotation": [-0.55, 0, 0],
      "color": "#8d6e63"
    },

    {
      "type": "cube",
      "size": [12.8, 0.25, 5],
      "pos": [0, 4.7, -2.6],
      "rotation": [0.45, 0, 0],
      "color": "#8d6e63"
    },
    {
      "type": "cube",
      "size": [12.8, 0.25, 5],
      "pos": [0, 4.7, 2.6],
      "rotation": [-0.45, 0, 0],
      "color": "#8d6e63"
    },

    {
      "type": "cube",
      "size": [1.8, 3, 0.2],
      "pos": [0, 1.5, 6.15],
      "color": "#5d4037"
    },

    {
      "type": "cube",
      "size": [2, 2, 0.1],
      "pos": [-3.5, 2, 6.16],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },
    {
      "type": "cube",
      "size": [2, 2, 0.1],
      "pos": [3.5, 2, 6.16],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },

    {
      "type": "cube",
      "size": [0.1, 2, 2],
      "pos": [-6.05, 2, -3],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },
    {
      "type": "cube",
      "size": [0.1, 2, 2],
      "pos": [-6.05, 2, 3],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },
    {
      "type": "cube",
      "size": [0.1, 2, 2],
      "pos": [6.05, 2, -3],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },
    {
      "type": "cube",
      "size": [0.1, 2, 2],
      "pos": [6.05, 2, 3],
      "color": "#80d8ff",
      "metalness": 0.9,
      "roughness": 0.05
    },

    {
      "type": "cube",
      "size": [4, 0.25, 3],
      "pos": [0, 0.2, 7.5],
      "color": "#b08968"
    },

    {
      "type": "cube",
      "size": [0.25, 3, 0.25],
      "pos": [-1.8, 1.5, 8.7],
      "color": "#8d6e63"
    },
    {
      "type": "cube",
      "size": [0.25, 3, 0.25],
      "pos": [1.8, 1.5, 8.7],
      "color": "#8d6e63"
    },

    {
      "type": "cube",
      "size": [0.8, 2.5, 0.8],
      "pos": [-3.5, 5.8, -2],
      "color": "#9e9e9e"
    },

    {
      "type": "cube",
      "size": [0.5, 4.5, 0.5],
      "pos": [-6, 2.25, -6],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    },
    {
      "type": "cube",
      "size": [0.5, 4.5, 0.5],
      "pos": [6, 2.25, -6],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    },
    {
      "type": "cube",
      "size": [0.5, 4.5, 0.5],
      "pos": [-6, 2.25, 6],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    },
    {
      "type": "cube",
      "size": [0.5, 4.5, 0.5],
      "pos": [6, 2.25, 6],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    },

    {
      "type": "cube",
      "size": [2, 2, 2],
      "pos": [5.5, 1, 5.5],
      "rotation": [
        0,
        2.356194490192345,
        0
      ],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    },

    {
      "type": "cube",
      "size": [1.2, 1.2, 1.2],
      "pos": [-5.5, 0.8, 5.5],
      "rotation": [
        0,
        2.356194490192345,
        0
      ],
      "color": "#00e5ff",
      "metalness": 1,
      "roughness": 0.05
    },

    {
      "type": "cube",
      "size": [1.5, 0.15, 1.5],
      "pos": [0, 6.1, 0],
      "rotation": [
        0,
        2.356194490192345,
        0
      ],
      "color": "#d4af37",
      "metalness": 1,
      "roughness": 0.25
    }
  ]

};