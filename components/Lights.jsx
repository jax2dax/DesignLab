export default function Lights({ ambientIntensity, directionalIntensity, directionalPos }) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={directionalPos} intensity={directionalIntensity} />
    </>
  );
}