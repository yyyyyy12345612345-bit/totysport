"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/features/language/LanguageProvider";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";

/* ── Inline SVG: Football Jersey Silhouette ──────────── */
function JerseySVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4 L3 8 L6 10 L6 20 L18 20 L18 10 L21 8 L18 4 L14 7 C13 7.5 11 7.5 10 7 Z" />
      <path d="M10 11 L10 16" strokeWidth="2" />
      <path d="M14 11 L14 16" strokeWidth="2" />
    </svg>
  );
}

export function HeroSection() {
  const { language, t } = useLanguage();
  const [, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(console.error);
  }, []);

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center bg-[#0c0e12] text-white overflow-hidden pt-20 sm:pt-24 pb-12 text-left" dir="ltr">
      {/* ── BACKGROUND HERO IMAGE (PLAYER UNDER STADIUM FLOODLIGHTS) ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Clean player backdrop image positioned on right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <picture className="absolute top-0 right-0 h-full w-full pointer-events-none select-none">
          <source srcSet="/images/hero_culture_backdrop.webp" type="image/webp" />
          <img
            src="/images/hero_culture_backdrop.png"
            alt="Play The Culture - Toty Sport"
            className="h-full w-full object-cover object-[75%_top] sm:object-right opacity-95 pointer-events-none select-none"
          />
        </picture>

        {/* Stadium Floodlight Radial Atmosphere */}
        <div className="absolute top-0 left-0 w-[550px] h-[450px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
        {/* Dark gradient fade on the left to guarantee 100% text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e12] via-[#0c0e12]/75 to-transparent w-full sm:w-[65%]" />
        {/* Bottom edge shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0c0e12] to-transparent" />
      </div>

      {/* ── MAIN CONTENT CONTAINER (MATCHES USER MOCKUP EXACTLY) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full py-8 sm:py-16 text-left">
        <div className="max-w-[300px] sm:max-w-md lg:max-w-xl text-left">
          


          {/* 2. Giant Headline: PLAY THE CULTURE. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-[950] tracking-tight uppercase text-white leading-[0.9] select-none my-2 sm:my-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] text-left"
          >
            PLAY<br />
            THE<br />
            CULTURE.
          </motion.h1>



          {/* 4. Action Button: SHOP JERSEYS (Dark Glassmorphism Pill) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 sm:mt-7 text-left"
          >
            <button
              onClick={handleScroll}
              className="w-full max-w-[260px] sm:max-w-[290px] h-12 sm:h-13 rounded-full bg-[#16181f]/85 hover:bg-[#20232d] border border-white/25 hover:border-[#ccff00]/80 backdrop-blur-md px-4 sm:px-5 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ArrowRight
                  size={18}
                  className="text-zinc-300 group-hover:text-[#ccff00] group-hover:translate-x-1 transition-all"
                />
                <span className="font-[950] text-xs sm:text-sm tracking-[0.2em] uppercase text-white">
                  SHOP JERSEYS
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-black/60 border border-[#ccff00] flex items-center justify-center text-[#ccff00] shadow-sm flex-shrink-0">
                <JerseySVG className="w-3.5 h-3.5 text-[#ccff00]" />
              </div>
            </button>
          </motion.div>

          {/* 5. Secondary Action Link: EXPLORE COLLECTION -> */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5"
          >
            <a
              href="#products"
              onClick={handleScroll}
              className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.25em] uppercase text-zinc-300 hover:text-white border-b border-white/60 pb-0.5 hover:border-white transition-colors cursor-pointer select-none"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={13} />
            </a>
          </motion.div>

        </div>
      </div>

      {/* ── FLOATING ACTION BUTTONS ON RIGHT (EXACT MATCH WITH HERO_CULTURE.PNG) ── */}
      <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto">
        {/* Size Guide / Catalog Button */}
        <button
          onClick={handleScroll}
          title="Catalog & Sizes"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer border border-zinc-200"
          aria-label="View jerseys collection"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="9" y1="4" x2="9" y2="20" />
            <line x1="15" y1="4" x2="15" y2="20" />
          </svg>
        </button>

        {/* WhatsApp / Chat Button */}
        <a
          href="https://wa.me/201017730999"
          target="_blank"
          rel="noopener noreferrer"
          title="Contact on WhatsApp"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#7c3aed] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer border border-zinc-200"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2.12 21.6c-.16.51.32.99.83.83l4.53-1.26C8.97 21.75 10.45 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
        </a>
      </div>
    </section>
  );
}
