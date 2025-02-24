import { useRef } from "react"
import { useFrame, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"

const BackgroundMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / resolution.xy;
      vec3 color1 = vec3(0.1, 0.1, 0.2); // Dark blue
      vec3 color2 = vec3(0.3, 0.2, 0.4); // Purple
      
      // Create gradient
      vec3 gradient = mix(color1, color2, st.y);
      
      // Add some "stars"
      float star = random(st + time * 0.1);
      if (star > 0.99) {
        gradient += vec3(0.5, 0.5, 0.5);
      }
      
      // Add some moving "particles"
      vec2 particlePosition = fract(st + vec2(time * 0.1, time * 0.05));
      float particle = 1.0 - smoothstep(0.0, 0.01, length(particlePosition - vec2(0.5)));
      gradient += vec3(0.2, 0.2, 0.3) * particle;

      gl_FragColor = vec4(gradient, 1.0);
    }
  `,
)

// Extend BackgroundMaterial for use in React Three Fiber
extend({ BackgroundMaterial })

export function FuturisticBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.resolution.value.set(state.size.width, state.size.height)
    }
  })

  return (
    <mesh position={[0, 0, -1]} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <backgroundMaterial ref={materialRef} transparent opacity={0.8} depthWrite={false} />
    </mesh>
  )
}

