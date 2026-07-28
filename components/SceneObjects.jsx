import ShapeMesh from "./ShapeMesh";

export default function SceneObjects({ data }) {
  return data.map((obj, i) => <ShapeMesh key={i} {...obj} />);
}