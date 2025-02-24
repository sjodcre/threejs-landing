// // import { Navbar } from "@/components/navbar"
// import { Canvas } from "@react-three/fiber"
// import Web3Ecosystem from "../components/Web3Ecosystem"

// export default function Home() {
//     return (
//         <div className="w-full h-screen">
//             <Canvas>
//                 <Web3Ecosystem />
//             </Canvas>
//         </div>
//     )
// }

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Float, Environment } from "@react-three/drei"
import { Suspense } from "react"
import Web3Ecosystem from "../components/Web3Ecosystem"

export default function Home() {
  return (
    <div className="w-full h-screen relative">
      {/* Futuristic background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/futuristic-background.jpg')",
        }}
      />

      {/* Canvas with increased z-index to appear above the background */}
      <div className="relative z-10 w-full h-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <Float floatIntensity={2} rotationIntensity={0.5}>
              {/* <Text font="/fonts/Inter-Bold.ttf" fontSize={1.5} position={[0, 3, 0]} color="#ffffff"> */}
                Welcome to Web3 Ecosystem
              {/* </Text> */}
            </Float>

            <Web3Ecosystem />

            <OrbitControls enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>

    </div>
  )
}

