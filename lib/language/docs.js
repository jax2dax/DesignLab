export const LANGUAGE_DOCS = `
SCENE LANGUAGE DOCUMENTATION

Every statement has the form:

  KEYWORD ["name"] {
    field: value
    field: value
  }

There are two kinds of keyword:

1. SHAPE TYPES (add a new mesh): cube, sphere
   TYPE "optional-name" {
     group: <string>            (which group this mesh belongs to; default "generated")
     pos: <x>, <y>, <z>         (required)
     size: <x>, <y>, <z>        (required for cube)
     radius: <number>            (required for sphere)
     rotation: <x>, <y>, <z>    (optional, degrees, default 0,0,0)
     color: <hex string>         (optional)
     material: <preset name>     (optional: dark-wood, light-wood, stone, brushed-steel, gold, glass, matte-plastic)
     metalness: <0 to 1>         (optional)
     roughness: <0 to 1>         (optional)
   }
   The name is optional — if omitted, one is generated automatically (e.g. "cube3"). If given, it must not already exist.

2. VERBS (act on an existing mesh, target by name — name is REQUIRED):
   claw "name" { field: value ... }
     Edits the named mesh. Only the fields listed are changed — every other
     property of that mesh is left exactly as it was. This is a PATCH, not a
     full replacement.

   slay "name" {}
     Deletes the named mesh. Body must be present but is ignored — write {}.

Every mesh in the scene has a unique "name" (separate from its group). Names
are how claw/slay find their target — group names can repeat across many
meshes ("wall" might contain 6 cubes), but a mesh's own name never does.

Multiple statements can appear in one script, separated by a blank line.
Statements are independent — one failing does not stop the others from running,
and every problem found is reported, not just the first one.

EXAMPLES

  cube "porch_pillar" {
    group: house
    pos: 0, 3.1, 7.2
    size: 4.5, 0.25, 3.5
    rotation: 0, 0, 0
    color: #5d4037
  }

  claw "porch_pillar" {
    color: #000000
  }

  slay "old_bench" {}
`.trim();