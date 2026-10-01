"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TotyMatchIntroProps {
  onComplete: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   PHASE 1: FLOODLIGHTS — each flickers twice then stabilizes
   ═══════════════════════════════════════════════════════════════ */
function Floodlight({ index, active }: { index: number; active: boolean }) {
  const positions = [
    { top: "2%", left: "8%", rotate: "25deg" },
    { top: "2%", right: "8%", rotate: "-25deg" },
    { top: "5%", left: "30%", rotate: "12deg" },
    { top: "5%", right: "30%", rotate: "-12deg" },
  ];
  const pos = positions[index];

  return (
    <motion.div
      className="absolute z-[3]"
      style={{ top: pos.top, left: pos.left, right: pos.right }}
      initial={{ opacity: 0 }}
      animate={active ? {
        opacity: [0, 0.9, 0.2, 1, 0.3, 1],
      } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.3,
        times: [0, 0.15, 0.3, 0.5, 0.65, 1],
        ease: "easeOut",
      }}
    >
      {/* Floodlight bulb */}
      <div className="relative">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_20px_8px_rgba(255,255,255,0.8),0_0_60px_20px_rgba(230,255,46,0.3)]" />
        {/* Lens flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 blur-sm" />
      </div>
      {/* Light cone */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 opacity-[0.08]"
        style={{
          borderLeft: "80px solid transparent",
          borderRight: "80px solid transparent",
          borderTop: "280px solid rgba(255,255,255,0.6)",
          transform: `translateX(-50%) rotate(${pos.rotate})`,
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PHASE 2: PITCH LINES — SVG drawn with stroke-dashoffset
   ═══════════════════════════════════════════════════════════════ */
function PitchSVG({ active }: { active: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none"
      style={{ perspective: "800px" }}
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 680 440"
        className="w-[90vw] sm:w-[70vw] max-w-[750px] h-auto"
        style={{
          transform: "rotateX(25deg) rotateZ(0deg)",
          transformOrigin: "center center",
        }}
        fill="none"
      >
        {/* Grass background */}
        <defs>
          <pattern id="grass" width="40" height="440" patternUnits="userSpaceOnUse">
            <rect width="20" height="440" fill="#0F5C2E" />
            <rect x="20" width="20" height="440" fill="#0D5228" />
          </pattern>
        </defs>
        <motion.rect
          x="0" y="0" width="680" height="440" rx="4"
          fill="url(#grass)"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 0.7 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Outer boundary */}
        <motion.rect
          x="30" y="20" width="620" height="400" rx="2"
          stroke="white" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
        />

        {/* Center line */}
        <motion.line
          x1="340" y1="20" x2="340" y2="420"
          stroke="white" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
        />

        {/* Center circle */}
        <motion.circle
          cx="340" cy="220" r="65"
          stroke="white" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
        />

        {/* Center dot */}
        <motion.circle
          cx="340" cy="220" r="4"
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 0.8, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 1 }}
        />

        {/* Left penalty area */}
        <motion.rect
          x="30" y="110" width="120" height="220" rx="1"
          stroke="white" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeInOut" }}
        />

        {/* Right penalty area */}
        <motion.rect
          x="530" y="110" width="120" height="220" rx="1"
          stroke="white" strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ duration: 0.7, delay: 1.1, ease: "easeInOut" }}
        />

        {/* Left goal */}
        <motion.rect
          x="10" y="175" width="20" height="90" rx="1"
          stroke="white" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.5 } : {}}
          transition={{ duration: 0.4, delay: 1.2 }}
        />

        {/* Right goal */}
        <motion.rect
          x="650" y="175" width="20" height="90" rx="1"
          stroke="white" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.5 } : {}}
          transition={{ duration: 0.4, delay: 1.3 }}
        />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PHASE 3: JERSEY SVG — draws then flips to show brand
   ═══════════════════════════════════════════════════════════════ */
function JerseySVG({ active, showBack }: { active: boolean; showBack: boolean }) {
  return (
    <motion.div
      className="relative z-[5] flex flex-col items-center"
      initial={{ scale: 0, opacity: 0, rotateY: 0 }}
      animate={active ? {
        scale: 1,
        opacity: 1,
        rotateY: showBack ? 180 : 0,
      } : {}}
      transition={{
        scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.4 },
        rotateY: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Shadow underneath */}
      <motion.div
        className="absolute -bottom-4 w-28 h-3 bg-black/50 rounded-[50%] blur-md"
        animate={active ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div style={{ transformStyle: "preserve-3d" }} className="relative">
        {/* Front face */}
        <div style={{ backfaceVisibility: "hidden" }}>
          <svg viewBox="0 0 160 190" className="w-28 h-32 sm:w-36 sm:h-40">
            {/* Jersey body - drawn with stroke first */}
            <motion.path
              d="M40,30 L20,50 L30,65 L30,170 L130,170 L130,65 L140,50 L120,30 L105,45 C95,52 65,52 55,45 Z"
              stroke="#E6FF2E"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={active ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Fill after stroke */}
            <motion.path
              d="M40,30 L20,50 L30,65 L30,170 L130,170 L130,65 L140,50 L120,30 L105,45 C95,52 65,52 55,45 Z"
              fill="#0B0B0B"
              stroke="#E6FF2E"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
            {/* Stripes */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 0.3 } : {}}
              transition={{ delay: 1 }}
            >
              <line x1="60" y1="55" x2="60" y2="170" stroke="#E6FF2E" strokeWidth="0.5" />
              <line x1="80" y1="48" x2="80" y2="170" stroke="#E6FF2E" strokeWidth="0.5" />
              <line x1="100" y1="55" x2="100" y2="170" stroke="#E6FF2E" strokeWidth="0.5" />
            </motion.g>
          </svg>
        </div>

        {/* Back face (flipped) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <svg viewBox="0 0 160 190" className="w-28 h-32 sm:w-36 sm:h-40">
            <path
              d="M40,30 L20,50 L30,65 L30,170 L130,170 L130,65 L140,50 L120,30 L105,45 C95,52 65,52 55,45 Z"
              fill="#0B0B0B"
              stroke="#E6FF2E"
              strokeWidth="1.5"
            />
            {/* Brand name */}
            <text
              x="80" y="90"
              textAnchor="middle"
              fill="#E6FF2E"
              fontSize="14"
              fontWeight="900"
              letterSpacing="3"
              fontFamily="system-ui, sans-serif"
            >
              TOTY
            </text>
            {/* Number */}
            <text
              x="80" y="148"
              textAnchor="middle"
              fill="#E6FF2E"
              fontSize="48"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              10
            </text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAMERA FLASHES — random white bursts
   ═══════════════════════════════════════════════════════════════ */
const FLASH_POSITIONS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 88) + 6,
  y: ((i * 23 + 7) % 22) + 3,
  delay: ((i * 31) % 100) / 80,
  size: 2 + ((i * 17) % 4),
}));

function CameraFlashes({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      {FLASH_POSITIONS.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0, 0.8, 0, 0.6, 0],
            scale: [0, 1.5, 0, 1.2, 0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: f.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GOAL NET — SVG grid with ripple, splits open as curtain
   ═══════════════════════════════════════════════════════════════ */
function GoalNet({ active, split }: { active: boolean; split: boolean }) {
  return (
    <AnimatePresence>
      {active && !split && (
        <motion.div
          className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            {/* Net grid */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={5 * (i + 1)} y1="0" x2={5 * (i + 1)} y2="100"
                stroke="white" strokeWidth="0.15" opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              />
            ))}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0" y1={5 * (i + 1)} x2="100" y2={5 * (i + 1)}
                stroke="white" strokeWidth="0.15" opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLYING BALL — curves from corner to center
   ═══════════════════════════════════════════════════════════════ */
function FlyingBall({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute z-[7] w-8 h-8 sm:w-10 sm:h-10"
      initial={{ left: "-5%", bottom: "20%", rotate: 0, scale: 0.5, opacity: 0 }}
      animate={{
        left: ["-5%", "30%", "48%"],
        bottom: ["20%", "60%", "48%"],
        rotate: [0, 360, 720],
        scale: [0.5, 0.8, 1],
        opacity: [0, 1, 1],
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ filter: "blur(0.5px)" }}
    >
      <div className="w-full h-full rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-zinc-300 relative overflow-hidden">
        <div className="absolute inset-[20%] border border-zinc-400 rounded-full" />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILM GRAIN OVERLAY
   ═══════════════════════════════════════════════════════════════ */
function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 z-[9] pointer-events-none opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   ██  MAIN INTRO COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export function TotyMatchIntro({ onComplete }: TotyMatchIntroProps) {
  const [phase, setPhase] = useState(0);
  const [show, setShow] = useState(true);
  const [counter, setCounter] = useState(0);
  const [showJerseyBack, setShowJerseyBack] = useState(false);
  const [statusText, setStatusText] = useState("الماتش هيبدأ...");
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Counter 0 → 100
  useEffect(() => {
    if (counter >= 100) return;
    const interval = setInterval(() => {
      setCounter((c) => {
        const next = c + Math.ceil(Math.random() * 4 + 1);
        return Math.min(next, 100);
      });
    }, 55);
    return () => clearInterval(interval);
  }, [counter]);

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),    // Floodlights
      setTimeout(() => setPhase(2), 2500),     // Pitch lines
      setTimeout(() => setPhase(3), 4000),     // Jersey front
      setTimeout(() => {                        // Jersey flip
        setShowJerseyBack(true);
        setStatusText("يلا نلعب! ⚽");
      }, 4600),
      setTimeout(() => setPhase(4), 5200),     // Camera flashes
      setTimeout(() => setPhase(5), 6000),     // Goal + net
      setTimeout(() => setPhase(6), 6500),     // Split exit
      setTimeout(() => setShow(false), 7000),  // Done
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSkip = useCallback(() => setShow(false), []);

  return (
    <AnimatePresence onExitComplete={() => onCompleteRef.current()}>
      {show && (
        <motion.div
          key="toty-match-intro"
          className="fixed inset-0 z-[99999] bg-[#0B0B0B] text-white overflow-hidden select-none"
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
          suppressHydrationWarning
        >
          {/* ── Film Grain ── */}
          <GrainOverlay />

          {/* ── Skip Button ── */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[20] text-[10px] sm:text-xs text-zinc-600 hover:text-zinc-300 font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 rounded-full"
          >
            SKIP
          </button>

          {/* ═══ PHASE 0: DARKNESS + COUNTER ═══ */}
          <motion.div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-[15] flex flex-col items-center gap-2"
            animate={phase >= 5 ? { opacity: 0, y: 20 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Counter */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-[950] tracking-wider text-[#E6FF2E] tabular-nums font-mono">
                {String(counter).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-zinc-600 font-bold">%</span>
            </div>
            {/* Status text */}
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-xs text-zinc-500 font-bold tracking-wider"
            >
              {statusText}
            </motion.p>
          </motion.div>

          {/* ═══ PHASE 1: FLOODLIGHTS ═══ */}
          {[0, 1, 2, 3].map((i) => (
            <Floodlight key={i} index={i} active={phase >= 1} />
          ))}

          {/* Ambient glow from floodlights */}
          <motion.div
            className="absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 1.5 }}
            style={{
              background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            }}
          />

          {/* ═══ PHASE 2: PITCH LINES ═══ */}
          <PitchSVG active={phase >= 2} />

          {/* ═══ PHASE 3-4: JERSEY ═══ */}
          {phase >= 3 && (
            <div className="absolute inset-0 flex items-center justify-center z-[5]">
              <JerseySVG active={phase >= 3} showBack={showJerseyBack} />

              {/* ── TOTY SPORT text under jersey ── */}
              <motion.div
                className="absolute flex flex-col items-center"
                style={{ top: "calc(50% + 90px)" }}
                initial={{ opacity: 0, y: 15 }}
                animate={showJerseyBack ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-[950] tracking-[0.2em] uppercase pl-[0.2em]">
                  <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">TOTY</span>
                  <span className="text-[#E6FF2E] drop-shadow-[0_0_25px_rgba(230,255,46,0.5)] ml-2 sm:ml-4">SPORT</span>
                </h1>
                <motion.div
                  className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6FF2E] to-transparent mt-3"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <motion.p
                  className="mt-2 text-[9px] sm:text-[11px] font-bold tracking-[0.4em] text-zinc-500 uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  MORE THAN JUST A JERSEY
                </motion.p>
              </motion.div>
            </div>
          )}

          {/* ═══ PHASE 4: CAMERA FLASHES ═══ */}
          <CameraFlashes active={phase >= 4} />

          {/* ═══ PHASE 5: FLYING BALL ═══ */}
          <FlyingBall active={phase >= 5} />

          {/* ═══ PHASE 5: GOAL NET ═══ */}
          <GoalNet active={phase >= 5} split={phase >= 6} />

          {/* ═══ PHASE 6: NET SPLIT EXIT ═══ */}
          {phase >= 6 && (
            <>
              <motion.div
                className="absolute top-0 left-0 w-1/2 h-full bg-[#0B0B0B] z-[10]"
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                {/* Net pattern on left curtain */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="absolute w-full border-b border-white/10" style={{ top: `${(i + 1) * 6.25}%` }} />
                  ))}
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="absolute h-full border-r border-white/10" style={{ left: `${(i + 1) * 12.5}%` }} />
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="absolute top-0 right-0 w-1/2 h-full bg-[#0B0B0B] z-[10]"
                initial={{ x: 0 }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="absolute w-full border-b border-white/10" style={{ top: `${(i + 1) * 6.25}%` }} />
                  ))}
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="absolute h-full border-r border-white/10" style={{ left: `${(i + 1) * 12.5}%` }} />
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* ── Progress bar ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent z-[16]">
            <motion.div
              className="h-full bg-[#E6FF2E]"
              style={{ boxShadow: "0 0 8px #E6FF2E" }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: counter / 100 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
