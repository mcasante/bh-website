'use client'

import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMotionValue, useTransform } from "framer-motion";

import { useState } from "react"

import BlackHole from "./BlackHole";


const Data = () => {
  const scroll = useScroll()
  const value = useMotionValue(0);
  const opacity = useTransform(value, [0, .5, .9], [0, 0, 1]);
  const yOffset = useTransform(value, [.3, 1], [50, 0]);

  const [style, setStyle] = useState({
    opacity: 0,
    transform: "translate(0, 0)"
  })

  useFrame(() => {
    value.set(scroll.offset)

    setStyle({
      opacity: opacity.get(),
      transform: `translate(0, ${yOffset.get()}%)`
    })
  })

  return (
    <main>
      <div className="w-full h-[50svh] px-12 py-20 flex justify-between flex-col">
        <h1 className="text-xl font-thin uppercase mx-4">
          Hello!<br/> my name is <b>Math</b> and I'm a <b>frontend developer</b>
        </h1>
      </div>
      <div className="w-full h-[100svh] px-12 py-20 flex items-end justify-end">
        <div className="w-full max-w-3xl">
          <div
            style={style}
          >
            <p className="text-md text-justify font-thin">
              Hey there! 👋 I'm a <b>frontend developer</b> living on the edge. I work primarily with <b>Vue.js</b> and <b>Nuxt</b>, but I can algo write <b>React</b> and <b>Next.js</b> too.<br/><br/>

              Currently, I'm <b>Freaking out</b> 'cause, well, <b>I have no job!</b> Living the thrill, you know?<br/><br/>

              I daydream about bouldering all day, but I'm not the heir to a <b>multimillionaire</b>. So I have to work for a living.<br/><br/>

              If you've got a <b>job</b> for me, I'm <b>available</b> for <b>freelance</b> or <b>full-time</b> positions. Like, for real...
            </p>
            <h2 className="text-sm text-right font-thin mt-2">— Math in "A cry for help" </h2>
          </div>
        </div>
      </div>
    </main>
  )
}


const Scene = () => {
  return (
    <ScrollControls pages={1.5}>
      <Scroll>
        <BlackHole count={300_000} />
      </Scroll>
      <Scroll html className="w-full">
        <Data />
      </Scroll>
    </ScrollControls>
  );
};

const MainCanvas = () => {
  return (
    <Canvas gl={{ antialias: true }}>
      <ambientLight intensity={0.5} />
      <color attach="background" args={["#000000"]} />
      <Scene />
    </Canvas>
  );
}

export default MainCanvas;
