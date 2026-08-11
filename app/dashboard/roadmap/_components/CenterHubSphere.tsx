'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

export default function CenterHubSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Slow self rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25
      meshRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central Luminous Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#00D2FF"
          emissive="#7A00FF"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Outer Atmospheric Glow Shell */}
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point lights for local illumination */}
      <pointLight color="#00D2FF" intensity={3} distance={10} />
      <pointLight color="#A855F7" intensity={3} distance={10} />

      {/* Static Camera-Facing Center Text */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={0.38}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.05}
        >
          EchoRoadmap
        </Text>
      </Billboard>
    </group>
  )
}
