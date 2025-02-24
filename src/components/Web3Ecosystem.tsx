"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { type Group, Vector3, CatmullRomCurve3, type Mesh, BufferGeometry, type ShaderMaterial } from "three"
import { NodeMaterial } from "./NodeMaterial"
import { ParticleSystem } from "./ParticleSystem"

const Node = ({ position, name, color }: { position: [number, number, number]; name: string; color: string }) => {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.04)
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <NodeMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0, 0.45]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        textAlign="center"
      >
        {name}
      </Text>
      <Text
        position={[0, 0, -0.45]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8}
        textAlign="center"
        rotation={[0, Math.PI, 0]}
      >
        {name}
      </Text>
      <ParticleSystem count={50} color={color} />
    </group>
  )
}

const GlowingLineMaterial = shaderMaterial(
  {
    color: new Vector3(1, 1, 1),
    time: 0,
  },
  // Vertex Shader
  `
    uniform float time;
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 color;
    uniform float time;
    varying vec3 vPosition;
    void main() {
      float intensity = sin(vPosition.x * 10.0 + time * 2.0) * 0.5 + 0.5;
      vec3 glow = color * intensity;
      gl_FragColor = vec4(glow, intensity * 0.8);
    }
  `,
)

extend({ GlowingLineMaterial })

const CurvedLine = ({
  start,
  end,
  color,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
}) => {
  const curve = useMemo(() => {
    const startVector = new Vector3(...start)
    const endVector = new Vector3(...end)
    const midVector = new Vector3().addVectors(startVector, endVector).multiplyScalar(0.5)
    midVector.y += 0.5 // Add some curvature

    return new CatmullRomCurve3([startVector, midVector, endVector])
  }, [start, end])

  const points = useMemo(() => curve.getPoints(50), [curve])
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints(points)
    geometry.computeBoundingSphere()
    return geometry
  }, [points])

  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <glowingLineMaterial
        ref={materialRef}
        color={new Vector3(...color.match(/\w\w/g)!.map((x) => Number.parseInt(x, 16) / 255))}
        transparent
        depthWrite={false}
      />
    </line>
  )
}

export default function Web3Ecosystem() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  const nodeData = [
    { position: [0, 0, 0], name: "Blockchain", color: "#4CAF50" },
    { position: [2, 1, 0], name: "Smart Contracts", color: "#2196F3" },
    { position: [-2, 1, 0], name: "Wallets", color: "#FFC107" },
    { position: [0, -2, 0], name: "DApps", color: "#9C27B0" },
    { position: [1.5, -1, 1.5], name: "NFTs", color: "#E91E63" },
    { position: [-1.5, -1, -1.5], name: "DeFi", color: "#FF5722" },
  ]

  return (
    <group ref={groupRef}>
      {nodeData.map((node, index) => (
        <Node key={index} position={node.position} name={node.name} color={node.color} />
      ))}
      {nodeData.slice(1).map((node, index) => (
        <CurvedLine key={index} start={nodeData[0].position} end={node.position} color={node.color} />
      ))}
    </group>
  )
}

