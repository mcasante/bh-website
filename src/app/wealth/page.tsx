'use client'

import { OrbitControls } from "@react-three/drei";
import { Canvas, PointsMaterialProps, useFrame } from "@react-three/fiber";

import * as THREE from "three";
import vertexShader from "!!raw-loader!./vertexShader.glsl";
import fragmentShader from "!!raw-loader!./fragmentShader.glsl";
import sampleImage from "./sample-image-2.jpeg";

import { Suspense, useMemo, useRef, useEffect, useState } from "react";

interface ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;

}

const Wall = (props: { imageData: ImageData }) => {
  const { imageData: { width, height, data } } = props;
  const count = width * height;
  const radius = 8;

  console.log(count)

  const points = useRef<PointsMaterialProps>();
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2(0.0, 0.0));

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    mousePosition.current.x = (clientX / innerWidth) * 2 - 1;
    mousePosition.current.y = -(clientY / innerHeight) * 2 + 1;
  });

  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const scale = .05;

    for (let i = 0; i < count; i++) {
      const center = (width * scale) / 2;
      const position = [
        (i % width) * scale - center,
        Math.floor(i / width) * scale - center,
        0
      ]

      positions.set(position, i * 3);
      colors.set([
        data[i * 4] / 255,
        data[i * 4 + 1] / 255,
        data[i * 4 + 2] / 255,
      ],
      (count - i - 1) * 3 // fill backwards
      );
      
    }

    return { positions, colors };

  }, [count, data, width])

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: radius
    },
    uMouse: {
      value: new THREE.Vector2(0.0, 0.0)
    },
  }), [])

  useFrame((state) => {
    const { clock } = state;

    points.current!.material.uniforms.uTime.value = clock.elapsedTime;

    const { x, y } = mousePosition.current;
    points.current!.material.uniforms.uMouse.value.x = x;
    points.current!.material.uniforms.uMouse.value.y = y;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesData.positions.length / 3}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesData.colors.length / 3}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        // blending={THREE.AdditiveBlending}
        blending={THREE.NormalBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

const ImageLoader = () => {
  const [imageData, setImageData] = useState<ImageData>();

  useEffect(() => {
    const loader = new THREE.ImageLoader();

    const loadImageData = async () => {
      const imgData = await new Promise<ImageData>((resolve) => {
        loader.load(
          sampleImage.src,
          function (image: HTMLImageElement) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = image.height;
            canvas.width = image.width;
            
            context!.drawImage(image, 0, 0);

            resolve({
              width: image.width,
              height: image.height,
              data: context!.getImageData(0, 0, image.width, image.height).data,
            });
          }
        );
      });

      setImageData(imgData);
    };

    loadImageData();
  }, []);

  return imageData ? <Wall imageData={imageData} /> : null;
};


const Scene = () => {
  return (
    <group>
      <Suspense fallback={null}>
        <ImageLoader />
      </Suspense>
    </group>
  );
};


const MainCanvas = () => {
  return (
    <main className="w-full h-[100svh]">
      <Canvas gl={{ antialias: true }}>
        <ambientLight intensity={2} />
        <OrbitControls />
        <color attach="background" args={["#444444"]} />
        <Scene />
      </Canvas>
    </main>
  );
}

export default MainCanvas;