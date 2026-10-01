"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Send } from "lucide-react";
import { toast } from "sonner";
import { createContactMessage } from "@/lib/firebase/firestore";
import { useSiteSettings } from "@/features/settings/SiteSettingsProvider";
import { useLanguage } from "@/features/language/LanguageProvider";
import { Spinner } from "@/components/ui/Spinner";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const { language, isRTL, t } = useLanguage();

  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAr = language === "ar";
  const storeEmail = settings?.storeEmail || "totysport.official@gmail.com";
  const whatsappNumber = "+20 12 72168789";
  const whatsappUrl = "https://wa.me/201272168789";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/toty_sport22/";
  const tiktokUrl = settings?.tiktokUrl || "https://www.tiktok.com/@toty_sport22?_r=1&_t=ZS-9AAj8sgxdvM";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(isAr ? "يرجى كتابة الاسم" : "Please enter your name");
      return;
    }
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error(isAr ? "يرجى كتابة بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }
    if (!message.trim()) {
      toast.error(isAr ? "يرجى كتابة رسالتك" : "Please write your message");
      return;
    }

    setSubmitting(true);
    try {
      await createContactMessage({
        name: name.trim(),
        email: emailInput.trim(),
        message: message.trim(),
      });
      toast.success(
        isAr
          ? "تم استلام رسالتك بنجاح! سيتواصل معك فريق توتي سبورت قريباً."
          : "Your message has been received! Our team will respond shortly."
      );
      setName("");
      setEmailInput("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error(isAr ? "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً." : "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-black text-foreground transition-colors duration-300 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center sm:text-start"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
            {isAr ? "تواصل مباشر" : "Get in Touch"}
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {isAr ? "تواصل مع توتي سبورت" : "Contact Toty Sport"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-base sm:text-lg">
            {isAr
              ? "نحن هنا لمساعدتك في أي استفسار عن التيشرتات، المقاسات، والطلبات الخاصة."
              : "We're here to help anytime with jerseys, sizing, or custom orders."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            {[
              {
                icon: Phone,
                label: isAr ? "واتساب مباشر للطلبات السريعة 📥" : "WhatsApp Direct Orders 📥",
                value: whatsappNumber,
                href: whatsappUrl,
                colorStyle: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400",
                animate: true,
              },
              {
                icon: MapPin,
                label: isAr ? "المقر والموقع" : "Location",
                value: isAr ? "القاهرة، مصر (شحن لجميع المحافظات)" : "Cairo, Egypt (Fast shipping nationwide)",
                href: null,
                colorStyle: "bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-foreground",
              },
              {
                icon: Instagram,
                label: "Instagram",
                value: "@toty_sport22",
                href: instagramUrl,
                colorStyle: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/30 border-none",
                animate: true,
              },
              {
                icon: function TiktokSvg({ size = 20 }: { size?: number }) {
                  return (
                    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  );
                },
                label: "TikTok",
                value: "@toty_sport22",
                href: tiktokUrl,
                colorStyle: "bg-black border border-cyan-400/80 text-white shadow-md shadow-cyan-500/30",
                animate: true,
              },
              {
                icon: Mail,
                label: isAr ? "البريد الإلكتروني" : "Email Support",
                value: storeEmail,
                href: `mailto:${storeEmail}`,
                colorStyle: "bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-foreground",
              },
            ].map(({ icon: Icon, label, value, href, colorStyle, animate }) => (
              <motion.div
                key={label}
                whileHover={animate ? { scale: 1.02, x: isAr ? -4 : 4 } : undefined}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 group transition-all"
              >
                <motion.div
                  whileHover={animate ? { scale: 1.12, rotate: [0, -6, 6, 0] } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${colorStyle}`}
                >
                  <Icon size={20} />
                </motion.div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-bold text-sm text-foreground hover:text-emerald-500 transition-colors flex items-center gap-1.5"
                    >
                      <span className={href.includes("wa.me") ? "dir-ltr font-mono" : ""}>{value}</span>
                    </a>
                  ) : (
                    <p className="font-bold text-sm text-foreground">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {isAr ? "الاسم الكريم *" : "Full Name *"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? "أدخل اسمك الكريم" : "Your full name"}
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {isAr ? "رسالتك أو استفسارك *" : "Message *"}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isAr ? "اكتب استفسارك عن التيشرتات أو المقاسات..." : "How can we help you?"}
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none bg-white dark:bg-zinc-900"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {submitting ? (
                <Spinner size="sm" className="border-white dark:border-black border-t-transparent" />
              ) : (
                <>
                  <Send size={16} />
                  <span>{isAr ? "إرسال الرسالة الآن" : "Send Message"}</span>
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
