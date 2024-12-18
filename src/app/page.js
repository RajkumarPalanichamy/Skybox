"use client";
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

function CameraController() {
  const camera = useRef();
  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key.toLowerCase()] = true;
    };
    const handleKeyUp = (event) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    const speed = 0.1;

    // Forward/Backward
    if (keys.current.w) camera.position.z -= speed;
    if (keys.current.s) camera.position.z += speed;

    // Left/Right
    if (keys.current.a) camera.position.x -= speed;
    if (keys.current.d) camera.position.x += speed;
  });

  return null; // This component doesn't render anything
}

export default function BigBoxWithHDRI() {
  return (
    <Canvas>
      {/* HDRI Environment */}
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/golden_bay_2k.hdr" background />

      {/* Lighting */}
      <directionalLight intensity={1} position={[10, 10, 5]} />
      <ambientLight intensity={0.3} />

      {/* Big box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 5, 5]} />
        <meshStandardMaterial metalness={1} roughness={0} />
      </mesh>
<OrbitControls/>
      {/* Camera movement controller */}
      <CameraController />
    </Canvas>
  );
}
