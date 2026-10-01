"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { useLanguage } from "@/features/language/LanguageProvider";

export default function TermsPage() {
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

  const arSections = [
    {
      title: "قبول الشروط والأحكام",
      content:
        "باستخدامك لموقع ومتجر Toty Sport والشراء منه، فإنك توافق على هذه الشروط والأحكام الخاصة بالطلب والتوصيل والمعاينة داخل جمهورية مصر العربية.",
    },
    {
      title: "الطلبات والمخزون",
      content:
        "تخضع جميع الطلبات لتوفر المقاسات والموديلات في المخزن. في حالة نفاد أي مقاس أو موديل بعد إتمام الطلب، يتم التواصل فوراً مع العميل لتوفير بديل أو تعديل الطلب.",
    },
    {
      title: "الشحن والتوصيل بالقاهرة والمحافظات",
      content:
        "يتم شحن وتوصيل الطلبات خلال 24-48 ساعة لمحافظتي القاهرة والجيزة، ومن يومين إلى 4 أيام لباقي المحافظات، مع إمكانية معاينة المنتجات مع المندوب قبل السداد.",
    },
    {
      title: "الاستبدال والاسترجاع",
      content:
        "يتاح استبدال أو استرجاع التيشرت خلال 14 يوماً من الاستلام بشرط بقاء المنتج بحالته الأصلية تماماً بدون غسيل أو استخدام ومع البطاقات والتغليف الأصلي.",
    },
    {
      title: "طرق الدفع المتاحة",
      content:
        "نوفر خيارات الدفع عند الاستلام نقداً (COD)، بالإضافة إلى فودافون كاش ومحفظة انستاباي (InstaPay) المباشرة.",
    },
  ];

  const enSections = [
    {
      title: "Acceptance of Terms",
      content:
        "By browsing or placing an order on Toty Sport, you agree to these Terms of Service governing ordering, delivery, and inspection across Egypt.",
    },
    {
      title: "Orders & Inventory",
      content:
        "All jersey orders are subject to stock and size availability. If an item runs out after placement, our customer care team will contact you immediately to propose an alternative or adjust the order.",
    },
    {
      title: "Shipping & Nationwide Delivery",
      content:
        "Orders are delivered within 24–48 hours for Cairo & Giza, and 2–4 business days for other governorates, with full inspection upon delivery.",
    },
    {
      title: "Returns & Exchanges",
      content:
        "Jerseys may be exchanged or returned within 14 days of receipt, provided they are in unworn, unwashed condition with original tags and packaging intact.",
    },
    {
      title: "Payment Methods",
      content:
        "We offer Cash on Delivery (COD) across Egypt, as well as electronic payments via Vodafone Cash and InstaPay.",
    },
  ];

  const sections = isAr ? arSections : enSections;

  return (
    <div className="pt-24 min-h-screen bg-white dark:bg-black text-foreground font-sans transition-colors duration-300" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black tracking-tight mb-3">
          {isAr ? "الشروط والأحكام | Toty Sport" : "Terms of Service | Toty Sport"}
        </h1>
        <p className="text-gray-400 text-xs mb-10 font-medium">
          {isAr ? "آخر تحديث: 2026 • براند توتي سبورت الرسمي" : "Last updated: 2026 • Official Toty Sport Brand"}
        </p>

        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold mb-2 text-foreground">{title}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-normal">{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
