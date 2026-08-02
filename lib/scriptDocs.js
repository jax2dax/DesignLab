export const SCRIPT_DOCS = `
SCRIPT FORMAT DOCUMENTATION

The script format describes 3D shapes as blocks. Each block:

TYPE {
  group: <string>
  pos: <x>, <y>, <z>
  size: <x>, <y>, <z>        (cubes only, required)
  radius: <number>            (spheres only, required)
  rotation: <x>, <y>, <z>     (degrees, optional, default 0,0,0)
  color: <hex string like #a9db1f>   (optional)
  material: <preset name>     (optional — one of: dark-wood, light-wood, stone, brushed-steel, gold, glass, matte-plastic)
  metalness: <0 to 1>         (optional)
  roughness: <0 to 1>         (optional)
}

TYPE is one of: cube, sphere

Multiple blocks can appear in one script, separated by a blank line.
"group" is a label for organizing shapes — shapes with the same group name belong together (e.g. all shapes named "wall" form one wall group).
This format maps 1:1 to the app's internal JSON: { groupName: [ {type, pos, size|radius, rotation, color, material, metalness, roughness} ] }.
`.trim();