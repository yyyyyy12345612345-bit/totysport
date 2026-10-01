"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  MessageSquare,
  Lock,
  ShieldCheck,
  Truck,
  Instagram,
} from "lucide-react";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { useLanguage } from "@/features/language/LanguageProvider";

function TiktokIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function TotyBrandLogo({ size = "lg" }: { size?: "sm" | "lg" }) {
  if (size === "sm") {
    return (
      <Link href="/" className="inline-flex flex-col select-none group">
        <span className="text-xl font-black italic tracking-wider text-white leading-none group-hover:opacity-90 transition-opacity">
          TOT<span className="text-[#ccff00]">Y</span>
        </span>
        <span className="text-[8px] font-bold tracking-[0.35em] text-zinc-300 uppercase leading-tight mt-0.5">
          SPORT
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="inline-flex flex-col select-none group">
      <span className="text-3xl sm:text-4xl font-black italic tracking-wider text-white leading-none group-hover:opacity-90 transition-opacity">
        TOT<span className="text-[#ccff00]">Y</span>
      </span>
      <span className="text-[11px] sm:text-xs font-bold tracking-[0.4em] text-zinc-200 uppercase leading-tight mt-1.5">
        S P O R T
      </span>
      <div className="w-10 h-[3px] bg-[#ccff00] rounded-full mt-3" />
    </Link>
  );
}

export function Footer() {
  const pathname = usePathname();
  const { t, language, isRTL } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(console.error);
  }, []);

  // Hide footer on dedicated product details page
  if (pathname?.startsWith("/products/")) {
    return null;
  }

  const whatsappPhone = "+20 12 72168789";
  const whatsappUrl = "https://wa.me/201272168789";
  const tiktokUrl = settings?.tiktokUrl || "https://www.tiktok.com/@toty_sport22?_r=1&_t=ZS-9AAj8sgxdvM";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/toty_sport22/";
  const locationText = language === "ar" ? "القاهرة، مصر" : "Cairo, Egypt";

  const quickLinks = [
    { href: "/", label: t("footer.home") },
    { href: "/#products", label: t("footer.shop") },
    { href: "/about", label: t("footer.about") },
    { href: "/contact", label: t("footer.contact") },
  ];

  const policyLinks = [
    { href: "/shipping-policy", label: t("footer.shippingPolicy") },
    { href: "/privacy", label: t("footer.privacyPolicy") },
    { href: "/terms", label: t("footer.terms") },
  ];

  return (
    <footer
      className="relative bg-[#060709] text-white overflow-hidden font-sans border-t border-zinc-900 selection:bg-[#ccff00] selection:text-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── CSS ATMOSPHERIC STADIUM LIGHTING GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top floodlights spotlight */}
        <div className="absolute top-0 left-0 w-[500px] h-[350px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08)_0%,transparent_65%)]" />
        {/* Lime ambiance glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-[radial-gradient(circle_at_80%_30%,rgba(204,255,0,0.06)_0%,transparent_70%)]" />
        {/* Dark vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060709]/60 to-[#060709]" />
      </div>

      {/* ── TOP SECTION: BRAND INFO + HANGING MATCH JERSEY ── */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-16 sm:pb-14 relative">
          
          {/* Authentic Hanging Match Jersey (Cropped cleanly, responsive scale) */}
          <div
            className={`absolute top-0 ${isRTL ? "left-0 -scale-x-100" : "right-0"} w-36 sm:w-64 md:w-80 lg:w-[350px] h-full max-h-[460px] pointer-events-none select-none z-0 overflow-hidden opacity-35 sm:opacity-85 lg:opacity-95`}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer_jersey.png"
              alt="Toty Sport Match Jersey"
              className="w-full h-full object-contain sm:object-cover object-top"
            />
          </div>

          {/* Left Content Column */}
          <div className="relative z-10 max-w-xl">
            {/* Brand Logo */}
            <TotyBrandLogo />

            {/* Subtitle */}
            <h3 className="mt-5 text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              {t("footer.authenticKits")}
            </h3>

            {/* Tagline */}
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-normal">
              {t("footer.brandTagline")}
            </p>

            {/* 3-Item Contact Strip: Stacks on mobile, inline with hairline dividers on desktop */}
            <div className="mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 text-xs sm:text-sm">
              {/* 1. 24/7 Support */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-all flex-shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">
                    {t("footer.onlineSupport")}
                  </div>
                  <div className="font-bold text-white font-mono tracking-wide" dir="ltr">
                    {whatsappPhone}
                  </div>
                </div>
              </a>

              <div className="hidden sm:block h-7 w-px bg-white/15" />

              {/* 2. Headquarters */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">
                    {t("footer.locationLabel")}:
                  </div>
                  <div className="font-bold text-white">
                    {locationText}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block h-7 w-px bg-white/15" />

              {/* 3. Phone Direct */}
              <a
                href={`tel:${whatsappPhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 group hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-all flex-shrink-0">
                  <Phone size={16} />
                </div>
                <span className="font-bold text-white font-mono tracking-wide" dir="ltr">
                  {whatsappPhone}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE NAVIGATION SECTION (WITH SOCCER BALL ON LOWER-RIGHT) ── */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative">
          
          {/* Soccer Ball on Pitch Asset (Positioned on the bottom-right/left) */}
          <div
            className={`absolute bottom-0 ${isRTL ? "left-0 -scale-x-100" : "right-0"} w-32 sm:w-52 md:w-64 pointer-events-none select-none z-0 opacity-40 sm:opacity-75 lg:opacity-90 overflow-hidden`}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer_ball.png"
              alt="Match Soccer Ball"
              className="w-full h-auto object-contain object-bottom-right"
            />
          </div>

          {/* 3 Columns Navigation: 2 columns on mobile (right and left side) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-3xl">
            
            {/* Column 1: QUICK LINKS */}
            <div className="col-span-1">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {t("footer.quickLinks")}
              </h4>
              <div className="w-8 h-[2px] bg-[#ccff00] mt-1.5 mb-4" />
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      <span className="text-[#ccff00] font-bold transition-transform group-hover:translate-x-1 inline-block">
                        {isRTL ? "‹" : "›"}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: POLICIES & TERMS */}
            <div className="col-span-1">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {t("footer.policies")}
              </h4>
              <div className="w-8 h-[2px] bg-[#ccff00] mt-1.5 mb-4" />
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      <span className="text-[#ccff00] font-bold transition-transform group-hover:translate-x-1 inline-block">
                        {isRTL ? "‹" : "›"}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: FOLLOW US */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {t("footer.followUs")}
              </h4>
              <div className="w-8 h-[2px] bg-[#ccff00] mt-1.5 mb-4" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {/* TikTok Card */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group text-zinc-300 hover:text-white transition-all"
                >
                  <div className="w-10 h-10 rounded-full border border-white/70 group-hover:border-white group-hover:bg-white/10 flex items-center justify-center text-white transition-all flex-shrink-0">
                    <TiktokIcon size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-white transition-colors" dir="ltr">
                      @toty_sport22
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {t("footer.tiktokSub")}
                    </div>
                  </div>
                </a>

                {/* Instagram Card */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group text-zinc-300 hover:text-white transition-all"
                >
                  <div className="w-10 h-10 rounded-full border border-white/70 group-hover:border-white group-hover:bg-white/10 flex items-center justify-center text-white transition-all flex-shrink-0">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-white transition-colors" dir="ltr">
                      @toty_sport22
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {t("footer.instaSub")}
                    </div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 3. HORIZONTAL TRUST BADGES STRIP ── */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-8 text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-white" />
              <span>{t("footer.securePayments")}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-white" />
              <span>{t("footer.trustedBrand")}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Truck size={15} className="text-white" />
              <span>{t("footer.fastDelivery")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM COPYRIGHT & SPEED STRIPES ── */}
      <div className="relative z-10 border-t border-white/10 bg-black/70 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Mini Brand Logo */}
          <TotyBrandLogo size="sm" />

          {/* Center: Copyright */}
          <div className="text-[11px] sm:text-xs text-zinc-400 text-center font-medium">
            <span>{t("footer.allRightsReserved")}</span>
            <span className="mx-2 text-zinc-600">|</span>
            <span className="text-zinc-500">
              {t("footer.developedBy")}{" "}
              <a
                href="https://wa.me/2001020451206"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors font-semibold"
              >
                NextGen Devs
              </a>
            </span>
          </div>

          {/* Right: Small Social Icons + Red Speed Stripes */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <TiktokIcon size={16} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>

            {/* Angled Red Athletic Speed Stripes */}
            <div className="flex items-center gap-1 opacity-90 select-none">
              <span className="w-1.5 h-4 bg-[#ccff00] -skew-x-[25deg] block" />
              <span className="w-1.5 h-4 bg-[#ccff00] -skew-x-[25deg] block" />
              <span className="w-1.5 h-4 bg-[#ccff00] -skew-x-[25deg] block" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
