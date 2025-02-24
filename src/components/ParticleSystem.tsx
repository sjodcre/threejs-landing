import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export const ParticleSystem = ({ count, color }: { count: number; color: string }) => {
  const mesh = useRef<THREE.Points>(null)

  const particlesPosition = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    const r = 0.4 + Math.random() * 0.2
    particlesPosition[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    particlesPosition[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    particlesPosition[i * 3 + 2] = r * Math.cos(phi)
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color={color} transparent opacity={0.6} />
    </points>
  )
}

