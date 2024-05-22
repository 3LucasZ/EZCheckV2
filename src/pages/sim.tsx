import { Box } from "@chakra-ui/react";
// import { Canvas } from "@react-three/fiber";

export default function Sim() {
  return (
    <Box id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </Box>
  );
}
