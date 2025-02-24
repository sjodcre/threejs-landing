import React from "react"
import { shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const NodeMaterialImpl = shaderMaterial(
  {
    color: new THREE.Color(1, 1, 1),
    time: 0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 color;
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - dot(normal, viewDir), 2.0);
      
      vec3 baseColor = color * (0.5 + 0.5 * sin(time));
      vec3 glowColor = color * fresnel;
      
      gl_FragColor = vec4(baseColor + glowColor, 1.0);
    }
  `,
)

extend({ NodeMaterialImpl })

export const NodeMaterial = ({ color }: { color: string }) => {
  const materialRef = React.useRef<typeof NodeMaterialImpl>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
    }
  })

  return <nodeMaterialImpl ref={materialRef} color={new THREE.Color(color)} />
}

