"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";

function MeshComponent() {
  const width = 1.13;
  const height = 1.35;
  const depth = 0.5;
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.13, 1.35, 0.5]} />
      <meshStandardMaterial />
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1, 1, 1]} />
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
        <MeshComponent />
      </Canvas>
    </Flex>
  );
}
