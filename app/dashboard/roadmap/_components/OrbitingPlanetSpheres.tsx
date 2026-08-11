'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitingPlanetSpheresProps {
  onSelectUniverse: (universe: 'role' | 'dsa' | 'cs') => void
}

const ORBIT_RADIUS = 4.2

const PLANETS = [
  {
    id: 'role' as const,
    label: 'Role-Based',
    color: '#00D2FF',
    emissive: '#0055FF',
    angleOffset: 0
  },
  {
    id: 'dsa' as const,
    label: 'DSA Prep',
    color: '#00FF66',
    emissive: '#008833',
    angleOffset: (2 * Math.PI) / 3
  },
  {
    id: 'cs' as const,
    label: 'Core CS',
    color: '#9D00FF',
    emissive: '#5500AA',
    angleOffset: (4 * Math.PI) / 3
  }
]

export default function OrbitingPlanetSpheres({ onSelectUniverse }: OrbitingPlanetSpheresProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  const groupRefs = useRef<Record<string, THREE.Group | null>>({})
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({})
  const orbitAngleRef = useRef(0)

  useFrame((_, delta) => {
    // If a planet is selected, pause orbit & animate selected planet to center
    if (selectedPlanet) {
      const selectedGroup = groupRefs.current[selectedPlanet]
      if (selectedGroup) {
        selectedGroup.position.lerp(new THREE.Vector3(0, 0, 0), delta * 4)
        selectedGroup.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), delta * 4)
      }

      // Shrink & fade unselected planets
      PLANETS.forEach(p => {
        if (p.id !== selectedPlanet) {
          const unselectedGroup = groupRefs.current[p.id]
          if (unselectedGroup) {
            unselectedGroup.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 6)
          }
        }
      })
      return
    }

    // Normal Orbit Motion
    // Hovering slows orbital speed
    const speedMultiplier = hoveredPlanet ? 0.08 : 0.25
    orbitAngleRef.current += delta * speedMultiplier

    PLANETS.forEach(p => {
      const group = groupRefs.current[p.id]
      const mesh = meshRefs.current[p.id]

      if (group) {
        const currentAngle = orbitAngleRef.current + p.angleOffset
        const targetX = Math.cos(currentAngle) * ORBIT_RADIUS
        const targetZ = Math.sin(currentAngle) * ORBIT_RADIUS

        group.position.x = targetX
        group.position.z = targetZ
        group.position.y = Math.sin(currentAngle * 2) * 0.3 // Subtle vertical wave

        // Scale on hover
        const targetScale = hoveredPlanet === p.id ? 1.15 : 1.0
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6)
      }

      if (mesh) {
        mesh.rotation.y += delta * 0.4
      }
    })
  })

  const handleClick = (id: 'role' | 'dsa' | 'cs') => {
    setSelectedPlanet(id)
    setTimeout(() => {
      onSelectUniverse(id)
    }, 600)
  }

  return (
    <group>
      {/* 3D Thin Orbital Ring Visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ORBIT_RADIUS - 0.02, ORBIT_RADIUS + 0.02, 128]} />
        <meshBasicMaterial color="#333344" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {PLANETS.map(planet => (
        <group
          key={planet.id}
          ref={el => { groupRefs.current[planet.id] = el }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredPlanet(planet.id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredPlanet(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleClick(planet.id)
          }}
        >
          {/* Planetary Sphere */}
          <mesh ref={el => { meshRefs.current[planet.id] = el }}>
            <sphereGeometry args={[0.9, 48, 48]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.emissive}
              emissiveIntensity={hoveredPlanet === planet.id ? 0.9 : 0.5}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>

          {/* Glowing Atmosphere Ring on Hover */}
          {hoveredPlanet === planet.id && (
            <mesh>
              <sphereGeometry args={[1.02, 32, 32]} />
              <meshBasicMaterial color={planet.color} transparent opacity={0.3} side={THREE.BackSide} />
            </mesh>
          )}

          {/* Local Point Light */}
          <pointLight
            color={planet.color}
            intensity={hoveredPlanet === planet.id ? 4 : 2}
            distance={6}
          />

          {/* Static Camera-Facing Label Text Inside Sphere */}
          <Billboard follow lockX={false} lockY={false} lockZ={false}>
            <Text
              fontSize={0.24}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              letterSpacing={0.03}
            >
              {planet.label}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  )
}
