"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Heart, Globe, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useCart } from "@/features/cart/CartProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { useLanguage } from "@/features/language/LanguageProvider";
import { useSiteSettings } from "@/features/settings/SiteSettingsProvider";
import { cn } from "@/lib/utils";
import { Logo3D } from "@/components/ui/Logo3D";

const navItems = [
  { href: "/", key: "nav.home", defaultLabel: "الرئيسية" },
  { href: "/#products", key: "nav.shop", defaultLabel: "المتجر" },
  { href: "/about", key: "nav.about", defaultLabel: "من نحن" },
  { href: "/contact", key: "nav.contact", defaultLabel: "تواصل معنا" },
];

export function Header() {
  const { scrolled } = useScroll(75, 20);
  const { totalItems, toggleCart } = useCart();
  const { wishlist, toggleWishlistDrawer } = useWishlist();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
  const hasAnnouncement = Boolean(settings?.announcementEnabled && settings?.announcementText?.trim());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMobileSearch = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"], input[type="search"]') as HTMLInputElement | null;
        if (searchInput) searchInput.focus();
      }, 500);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-300",
          hasAnnouncement && !scrolled ? "top-8 sm:top-9" : "top-0",
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg py-1"
            : "bg-gradient-to-b from-black/75 via-black/25 to-transparent border-none py-2.5 sm:py-3 shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ── MOBILE HEADER (MATCHES USER MOCKUP EXACTLY: [🌐 EN]  TOTY  [🔍 ☰]) ── */}
          <div className="flex md:hidden items-center justify-between h-14" dir="ltr">
            {/* Left: Cart Button */}
            <motion.button
              onClick={toggleCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-full border border-white/25 bg-black/40 backdrop-blur-md p-2.5 flex items-center justify-center text-white hover:border-[#ccff00]/70 transition-all cursor-pointer shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} className="text-[#ccff00]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="mobile-cart-badge"
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-black text-[9px] font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Center: TOTY 3D Rotating Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center select-none"
                >
                  <Logo3D size={115} />
                </motion.div>
              </Link>
            </div>

            {/* Right: Search + Hamburger Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMobileSearch}
                className="p-2 text-white hover:text-[#ccff00] transition-colors cursor-pointer"
                aria-label="Search jerseys"
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-white hover:text-[#ccff00] transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* ── DESKTOP HEADER (SCREENS >= MD) ── */}
          <div className={cn("hidden md:flex items-center justify-between transition-all duration-300 relative", scrolled ? "h-16" : "h-20")}>
            {/* Left: Language + Wishlist + Nav links */}
            <div className="flex items-center gap-3 z-20">
              {/* Cart Button */}
              <motion.button
                onClick={toggleCart}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 transition-all duration-300 rounded-full bg-black/40 hover:bg-white/10 border border-white/25 text-white cursor-pointer shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={18} className="text-[#ccff00]" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="desktop-left-cart-badge"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-black text-[9px] font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist Toggle */}
              <motion.button
                onClick={toggleWishlistDrawer}
                className="relative p-2 transition-all duration-300 rounded-xl hover:bg-white/10 text-white cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Wishlist"
              >
                <Heart size={20} className={cn(wishlist.length > 0 ? "fill-red-500 text-red-500" : "")} />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      key="wishlist-badge"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Desktop Navigation Links */}
              <nav className="flex items-center gap-6 mx-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-bold tracking-wide transition-all duration-300 text-zinc-300 hover:text-white"
                  >
                    {t(item.key, item.defaultLabel)}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: TOTY 3D Rotating Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center py-1 select-none"
                >
                  <Logo3D size={scrolled ? 135 : 160} />
                </motion.div>
              </Link>
            </div>

            {/* Right: Cart Button */}
            <div className="flex items-center gap-3 z-20">
              <motion.button
                onClick={toggleCart}
                className="relative p-2 transition-all duration-300 rounded-xl hover:bg-white/10 text-white cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping cart"
              >
                <ShoppingBag size={22} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-black text-[10px] font-black rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className={cn(
                "fixed top-0 bottom-0 w-80 bg-zinc-950 border-zinc-800 z-[99999] flex flex-col pt-6 px-6 shadow-2xl overflow-y-auto text-white",
                isRTL ? "right-0 border-l" : "left-0 border-r"
              )}
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                <span className="text-2xl font-[950] tracking-wider text-white uppercase">
                  TOTY
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col py-6 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl font-bold text-base text-zinc-200 hover:text-white hover:bg-zinc-900/80 transition-all"
                  >
                    {t(item.key, item.defaultLabel)}
                  </Link>
                ))}
              </div>

              {/* Drawer Quick Actions: Cart & Wishlist */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    toggleCart();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-[#ccff00]" />
                    <span>{t("cart.title", "Shopping Cart")}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ccff00] text-black font-black text-xs">
                    {totalItems}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    toggleWishlistDrawer();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-red-500" />
                    <span>{t("nav.wishlist", "Wishlist")}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-xs">
                    {wishlist.length}
                  </span>
                </button>
              </div>

              {/* Language Controls */}
              <div className="mt-auto pt-6 pb-6 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs"
                >
                  <Globe size={14} className="text-[#ccff00]" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
