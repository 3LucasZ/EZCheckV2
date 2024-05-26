"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";

function LED() {}
function Frame() {
  const boxWidth = 1.13;
  const boxHeight = 1.35;
  const boxDepth = 0.5;

  const ledRadius = boxDepth / 2;
  const ledHeight = 0.3;

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
      <meshStandardMaterial />
      <mesh
        position={[-boxWidth / 2 + ledRadius, boxHeight / 2 + ledHeight / 2, 0]}
      >
        <cylinderGeometry args={[ledRadius, ledRadius, ledHeight]} />
        <meshStandardMaterial />
      </mesh>
    </mesh>
  );
}

export function EZCheck() {
  return (
    <Flex bg="black" h="100vh">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <Frame />
      </Canvas>
    </Flex>
  );
}
