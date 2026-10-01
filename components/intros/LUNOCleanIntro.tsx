"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LUNOCleanIntroProps {
  onComplete: () => void;
}

export function LUNOCleanIntro({ onComplete }: LUNOCleanIntroProps) {
  const [show, setShow] = useState(true);
  const [domeCompleted, setDomeCompleted] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 0.65s dome rise + 1.65s display = 2.3s total
    const timer = setTimeout(() => {
      setShow(false);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setShow(false);
  };

  return (
    <AnimatePresence onExitComplete={() => onCompleteRef.current()}>
      {show && (
        <motion.div
          key="luno-clean-dome-intro"
          onClick={handleSkip}
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Luxury curtain lift
            },
          }}
          transition={{
            duration: 0.65,
            ease: [0.32, 0.72, 0, 1], // Smooth fast dome entrance
          }}
          onAnimationComplete={() => setDomeCompleted(true)}
          className="fixed inset-0 z-[99999] bg-black text-white flex items-center justify-center select-none cursor-pointer overflow-visible"
        >
          {/* ── CONVEX DOME ARC ATTACHED TO TOP OF BLACK CURTAIN ── */}
          <div className="absolute bottom-full left-0 right-0 h-[22vh] sm:h-[30vh] overflow-visible pointer-events-none">
            <svg
              className="w-full h-full text-black fill-current"
              viewBox="0 0 100 28"
              preserveAspectRatio="none"
            >
              {/* Wide smooth convex dome curve leading upwards */}
              <path d="M 0,28 Q 50,0 100,28 Z" />
            </svg>
          </div>

          {/* ── MAIN INTRO CONTENT ── */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {domeCompleted && (
              <motion.div
                exit={{
                  y: -50,
                  opacity: 0.8,
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
                }}
                className="relative flex flex-col items-center justify-center px-8 py-12 overflow-hidden"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, filter: "blur(12px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex flex-col items-center justify-center gap-4 text-center px-4"
                >
                  {/* Toty Sport Emblem */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 mb-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="Toty Sport Emblem"
                      className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_35px_rgba(186,255,0,0.6)]"
                    />
                  </motion.div>

                  {/* Main Brand Text: "TOTY SPORT" */}
                  <div className="flex flex-col items-center">
                    <h1 className="relative text-5xl sm:text-7xl md:text-8xl font-[950] tracking-[0.18em] text-white uppercase drop-shadow-[0_0_40px_rgba(255,255,255,0.7)] z-10 pl-[0.18em]">
                      TOTY <span className="text-[#ccff00] drop-shadow-[0_0_30px_#ccff00]">SPORT</span>
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm font-bold tracking-[0.35em] text-zinc-400 uppercase">
                      More Than Just A Jersey ⚽
                    </p>
                  </div>

                  {/* Light Beam / Shimmer Effect Passing across the text */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent mix-blend-screen"
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{
                      duration: 1.1,
                      delay: 0.1,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 0.4,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Minimalist Accent Bottom Progress Line */}
          {domeCompleted && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 z-20">
              <motion.div
                className="h-full bg-white shadow-[0_0_12px_white]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

