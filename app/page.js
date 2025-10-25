"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import ImageCarousel from "../components/ImageCarousel";
import FeatureGrid from "../components/FeatureGrid";
import Features2 from "../components/Features2";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const stepsData = [
  {
    number: '01',
    title: 'Sign up via your company',
    description: 'A simple one-time setup. Just verify your employment details and link your bank account to receive funds.',
  },
  {
    number: '02',
    title: 'Access your earned salary',
    description: (
      <>
        Instantly transfer your earned pay to your account, anytime.
        No interest, just one small flat fee per transaction.
      </>
    ),
  },
  {
    number: '03',
    title: 'Build financial wellness',
    description: (
      <>
        Track your CIBIL score, set up automated savings, and get smart alerts
        to avoid low-balance fees. All in one app.
      </>
    ),
  },
];

export default function Home() {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start 0.5"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);
  
  const smoothLineHeight = useSpring(lineHeight, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="">
       <Navbar />
       <ImageCarousel />
       
       {/* Note: I removed overflow-clip, as it can sometimes interfere with scroll targets */}
       <div className="bg-yellow-300 text-black py-20 px-5 flex flex-col items-center font-sans">
      
        <h2 className="text-4xl font-bold mb-16">How it works</h2>

        <div ref={targetRef} className="flex flex-col gap-10 max-w-md text-center mb-16 relative">
          
          {/* --- START: REVISED ANIMATED LINE --- */}
          {/* This is the main 'line container'.
            It's positioned absolutely from the top circle to the bottom circle.
            It's behind the text (z-0).
          */}
          <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-px z-0">
            
            {/* 1. The Faint Track */}
            {/* This is the full-height, faint line (100% height of its parent) */}
            <div className="w-full h-full bg-black opacity-30" />
            
            {/* 2. The Growing Line */}
            {/* This sits on top of the faint track and grows its height from 0% to 100% */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-black"
              style={{ height: smoothLineHeight }} // height: 0% -> 100% of the parent div
            />
          </div>
          {/* --- END: REVISED ANIMATED LINE --- */}


          {stepsData.map((step) => (
            // This container MUST be relative, but needs no z-index itself
            <div key={step.number} className="flex flex-col items-center relative">
              
              {/* This circle sits on top of everything (z-20) */}
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4 relative z-20">
                {step.number}
              </div>
              
              {/* This text block masks the line (z-10) */}
              <div className="relative z-10 bg-yellow-300 px-4">
                <h3 className="text-3xl font-semibold mb-3">{step.title}</h3>
                <p className="text-base leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="bg-black text-white py-4 px-16 rounded-full text-base font-semibold cursor-pointer hover:bg-gray-800 transition-colors duration-300">
          Get started &rarr;
        </button>
      
      </div>
      <FeatureGrid />
      <Features2 />
    </div>
  );
}