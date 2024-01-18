import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

import vertexShader from "!!raw-loader!./vertexShader.glsl";
import fragmentShader from "!!raw-loader!./fragmentShader.glsl";

const BlackHole = (props) => {
  const { count } = props;
  const radius = 2;

  const points = useRef();
  const scroll = useScroll()

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomized = true;
    
    for (let i = 0; i < count; i++) {

      const [distance, theta, phi] = randomized 
        ? [
          Math.sqrt(Math.random()) * radius,
          THREE.MathUtils.randFloatSpread(360),
          THREE.MathUtils.randFloatSpread(360),
        ]
        : [
          radius/count * i,
          360/count * i,
          i
        ]

      let x = distance * Math.sin(theta) * Math.cos(phi)
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }
    
    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: radius
    },
  }), [])

  useFrame((state) => {
    const { clock } = state;

    const offset = .5 - scroll.offset

    const camPos = [
      (Math.sin(offset) * - 10),
      (Math.atan(offset * Math.PI * 3) * 2),
      (Math.cos((offset * Math.PI) / 3) * 5) 
    ]
    state.camera.position.set(...camPos)
    state.camera.lookAt(0, 0, 0)
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export default BlackHole;