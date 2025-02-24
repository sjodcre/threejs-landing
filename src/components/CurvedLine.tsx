"use client"

import { useMemo } from "react"
import { Vector3, CatmullRomCurve3 } from "three"
import { Line } from "@react-three/drei"

export const CurvedLine = ({
  start,
  end,
  color,
}: { start: [number, number, number]; end: [number, number, number]; color: string }) => {
  const points = useMemo(() => {
    const startVector = new Vector3(...start)
    const endVector = new Vector3(...end)
    const midVector = new Vector3().addVectors(startVector, endVector).multiplyScalar(0.5)
    midVector.y += 1 // Add some curvature

    const curve = new CatmullRomCurve3([startVector, midVector, endVector])

    return curve.getPoints(50)
  }, [start, end])

  return <Line points={points} color={color} lineWidth={2} />
}

