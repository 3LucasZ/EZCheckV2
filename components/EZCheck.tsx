"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import { Box, Flex } from "@chakra-ui/react";

function MeshComponent() {
  const fileUrl = "shiba/scene.gltf";
  const mesh = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  //   useFrame(() => {
  //     mesh.current.rotation.y += 0.01;
  //   });

  return (
    <mesh position={[1, 1, 1]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial />
      <mesh position={[1, 1, 1]}>
        <boxGeometry args={[3, 3, 3]} />
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
