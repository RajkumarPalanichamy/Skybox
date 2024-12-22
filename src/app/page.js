"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function CameraControls() {
  const cameraRef = useRef();
  const speed = 0.1;
  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key in keys.current) keys.current[event.key] = true;
    };

    const handleKeyUp = (event) => {
      if (event.key in keys.current) keys.current[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    direction.set(0, 0, 0);

    if (keys.current.w) direction.z -= 1;
    if (keys.current.s) direction.z += 1;
    if (keys.current.a) direction.x -= 1;
    if (keys.current.d) direction.x += 1;

    direction.normalize();
    velocity.copy(direction).multiplyScalar(speed);
    camera.position.add(velocity);
    cameraRef.current = camera; // Update the camera reference
  });

  return null;
}

export default function App() {
  const glb = useGLTF("room.glb");

  return (
    <Canvas camera={{ fov: 75, near: 0.001, far: 9999, position: [5, 1, -2.7] }}>
      <OrbitControls />
      <CameraControls />

      <Suspense fallback={null}>
        {/* Environment component applies the HDRI as a 360° background */}
        <Environment files="/hdr.hdr" background />

        {/* GLB Model */}
        <mesh>
          <primitive object={glb.scene} rotation={[0,2,0]} scale={[20, 20, 20]} />
        </mesh>

        {/* Plane at the bottom */}
        <mesh rotation={[-Math.PI / 2, 0, 2]} >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
