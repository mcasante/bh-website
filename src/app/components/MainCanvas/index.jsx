'use client'

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import vertexShader from "!!raw-loader!./vertexShader.glsl";
import fragmentShader from "!!raw-loader!./fragmentShader.glsl";

const CustomGeometryParticles = (props) => {
  const { count } = props;
  const radius = 2;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 

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
    uMouse: {
      value: [0.0, 0.0]
    }
  }), [])

  document.addEventListener("mousemove", (e) => {
    uniforms.uMouse.value[0] = (e.clientX - window.innerWidth / 2);
    uniforms.uMouse.value[1] = -(e.clientY - window.innerHeight / 2);

    // normalize mouse position between -1 and 1
    uniforms.uMouse.value[0] /= window.innerWidth / 8;
    uniforms.uMouse.value[1] /= window.innerHeight / 8;
  });

  useFrame((state) => {
    const { clock } = state;

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

const Scene = () => {
  return (
    <Canvas 
    // camera={{ position: [2.0, 2.0, 2.0] }}
    >
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles count={50000} />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
