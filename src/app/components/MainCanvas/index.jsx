'use client'

import { ScrollControls, Scroll } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

import BlackHole from "./BlackHole";

const Scene = () => {
  const page2 = useRef();
  return (
    <Canvas>
      <ScrollControls pages={2}>
        <Scroll>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.75, 64, 64]} />
            <meshBasicMaterial
              color="black"
            />
          </mesh>
          <BlackHole count={300000} />
          {/* <OrbitControls /> */}
          </Scroll>
        <Scroll html className="w-full">
          <main className="relative">
            <div className="absolute top-0 w-full h-[100svh] p-12">
              <div className="sticky w-full	h-full border border-white" />
            </div>
            <div className="w-full h-[100svh] px-12 py-20 flex justify-between flex-col">
              <h1 className="text-xl font-thin uppercase mx-4">
                Hello!<br/> my name is <b>Math</b> and I'm a <b>frontend developer</b>
              </h1>
              <button onClick={() => {
                page2.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}>
                <i className="arrow-down">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mt-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </i>
              </button>
            </div>
            <div ref={page2} className="w-full h-[100svh] px-12 py-20 flex items-end justify-end">
              <div>
                <p className="text-md text-justify font-thin">
                  Hey there! 👋 I'm a <b>frontend developer</b> living on the edge with no passion and <b>nothing to lose</b>. My mojo revolves around <b>Vue.js</b> and <b>Nuxt</b>, and I can groove with <b>React</b> and <b>Next.js</b> too.<br/><br/>

                  Currently, I'm <b>Freaking out</b> 'cause, well, <b>I have no job!</b> Living the thrill, you know?<br/><br/>

                  I daydream about bouldering all day, but I'm not the heir to a <b>multimillionaire</b>. So I have to work for a living.<br/><br/>

                  If you've got a <b>job</b> for me, I'm <b>available</b> for <b>freelance</b> or <b>full-time</b> positions. Like, for real...
                </p>
                <h2 className="text-sm text-right font-thin mt-2">— Math in "A cry for help" </h2>
              </div>
            </div>
          </main>
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};

export default Scene;
