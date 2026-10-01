"use client";

import { useEffect, useState } from "react";
import { Truck, ShieldCheck, RefreshCw, PhoneCall, Package } from "lucide-react";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { useLanguage } from "@/features/language/LanguageProvider";

export default function ShippingPolicyPage() {
  const { language, isRTL } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(console.error);
  }, []);

  const isAr = language === "ar";

  const defaultArPolicy = `1. الشحن والتوصيل:
- نقوم بالشحن والتوصيل لجميع محافظات جمهورية مصر العربية من مقرنا في القاهرة.
- يستغرق التوصيل داخل القاهرة والجيزة من 24 إلى 48 ساعة، ولباقي المحافظات من يومين إلى 4 أيام عمل.

2. حق المعاينة قبل الاستلام:
- يتاح للعميل فحص التيشرت والتأكد من المقاس والخامة بحضور مندوب الشحن قبل سداد قيمة الأوردر.

3. الاستبدال والاسترجاع:
- يحق للعميل استبدال أو استرجاع التيشرت خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون بحالته الأصلية غير مستخدم وبالتغليف الأصلي.
- في حالة وجود عيب مصنعي أو خطأ في الموديل أو المقاس المرسل، يتحمل المتجر كافة مصاريف الشحن بالكامل.`;

  const defaultEnPolicy = `1. Shipping & Delivery:
- We deliver to all Egyptian governorates from our headquarters in Cairo.
- Delivery within Cairo and Giza takes 24 to 48 hours, and 2 to 4 business days for other governorates.

2. Inspection on Delivery:
- Customers have the right to inspect the jersey, check size, and verify fabric quality in front of the courier before paying.

3. Returns & Exchange:
- Items can be returned or exchanged within 14 days of delivery, provided they remain in original brand-new unworn condition with tags attached.
- If there is any manufacturing defect or wrong item sent, Toty Sport covers all return and re-shipping fees.`;

  const policyContent = isAr
    ? (settings?.shippingPolicyText || defaultArPolicy)
    : defaultEnPolicy;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-black text-foreground font-sans transition-colors duration-300" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ccff00] mb-3">
          <Truck size={18} className="text-[#ccff00]" />
          <span>{isAr ? "سياسات TOTY SPORT الرسمية" : "OFFICIAL TOTY SPORT POLICIES"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-950 dark:text-white">
          {isAr ? "سياسة الشحن والمعاينة والاسترجاع" : "Shipping, Inspection & Returns Policy"}
        </h1>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-10">
          {isAr ? "آخر تحديث: 2026 | يرجى قراءة الشروط والتعليمات قبل إتمام الطلب" : "Last updated: 2026 | Please read carefully before ordering"}
        </p>

        {/* Highlight Cards Quick Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-black text-[#ccff00] flex items-center justify-center">
              <Package size={20} />
            </div>
            <h2 className="font-black text-sm text-zinc-900 dark:text-white">
              {isAr ? "شحن سريع من القاهرة" : "Fast Cairo Shipping"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {isAr ? "توصيل سريع وآمن لجميع المحافظات مع تأكيد الموعد مسبقاً." : "Swift insured delivery across all governorates."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-black text-emerald-400 flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <h2 className="font-black text-sm text-zinc-900 dark:text-white">
              {isAr ? "معاينة واستبدال سهل" : "Inspect & Easy Exchange"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {isAr ? "افتح العبوة وعاين التيشرت مع المندوب قبل دفع ثمن الطلب." : "Open and inspect your jersey before paying the courier."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-black text-cyan-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-black text-sm text-zinc-900 dark:text-white">
              {isAr ? "ضمان خامات الملاعب" : "Match-Grade Guarantee"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {isAr ? "خامات أصلية 100% مطابقة لأطقم الأندية والمنتخبات العالمية." : "100% authentic breathable match-grade fabrics."}
            </p>
          </div>
        </div>

        {/* Policy Details Container */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="prose dark:prose-invert max-w-none space-y-6 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
            {policyContent}
          </div>
        </div>

        {/* Direct Help Footer Section */}
        <div className="mt-12 p-6 rounded-2xl bg-black dark:bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center">
              <PhoneCall size={20} />
            </div>
            <div>
              <p className="font-black text-sm">{isAr ? "هل لديك استفسار بخصوص شحنتك؟" : "Have a question about your order?"}</p>
              <p className="text-xs text-zinc-400">{isAr ? "تواصل معنا عبر واتساب +20 12 72168789" : "Chat with us directly on WhatsApp +20 12 72168789"}</p>
            </div>
          </div>
          <a
            href="https://wa.me/201272168789"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#ccff00] text-black hover:opacity-90 transition-opacity rounded-xl font-black text-xs whitespace-nowrap shadow-md"
          >
            {isAr ? "محادثة واتساب فورية" : "WhatsApp Chat"}
          </a>
        </div>
      </div>
    </div>
  );
}
