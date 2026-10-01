"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { useLanguage } from "@/features/language/LanguageProvider";

export default function PrivacyPage() {
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
      title: "المعلومات التي نجمعها",
      content:
        "نقوم بجمع المعلومات الأساسية اللازمة لتوصيل طلبك فقط، مثل الاسم، ورقم الهاتف (للتواصل وتأكيد الشحن)، والعنوان التفصيلي ومحافظتك في مصر.",
    },
    {
      title: "كيف نستخدم بياناتك",
      content:
        "تُستخدم بياناتك فقط لتجهيز وشحن التيشرتات والتواصل معك بشأن تفاصيل التوصيل. نحن لا نشارك أو نبيع بياناتك الشخصية لأي طرف ثالث مطلقاً.",
    },
    {
      title: "أمان وخصوصية البيانات",
      content:
        "نتبع أعلى معايير الحماية لضمان سرية وأمان بياناتك. لا نقوم بحفظ أي بيانات بنكية أو بطاقات دفع على خوادمنا.",
    },
    {
      title: "ملفات تعريف الارتباط (الكوكيز)",
      content:
        "نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفحك لمتجر توتي سبورت وحفظ محتويات سلة مشترياتك والمفضلة.",
    },
    {
      title: "خدمة العملاء والتواصل",
      content:
        "إذا كان لديك أي استفسار بخصوص سياسة الخصوصية، يمكنك التواصل معنا مباشرة عبر واتساب: 01272168789 20+.",
    },
  ];

  const enSections = [
    {
      title: "Information We Collect",
      content:
        "We collect only the essential details required to deliver your jerseys: your name, phone number (for order confirmation and courier coordination), and delivery address across Egypt.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your information is used solely to process, pack, and deliver your sportswear orders. We never sell or share your personal data with third parties.",
    },
    {
      title: "Data Security",
      content:
        "We implement strict security measures to protect your personal information. Payment and card details are never stored on our servers.",
    },
    {
      title: "Cookies",
      content:
        "We use functional cookies to enhance your browsing experience, remember your language preference, and save your cart and wishlist items.",
    },
    {
      title: "Customer Support",
      content:
        "For any privacy inquiries, reach out directly to Toty Sport via WhatsApp at +20 12 72168789.",
    },
  ];

  const sections = isAr ? arSections : enSections;

  return (
    <div className="pt-24 min-h-screen bg-white dark:bg-black text-foreground font-sans transition-colors duration-300" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black tracking-tight mb-3">
          {isAr ? "سياسة الخصوصية | Toty Sport" : "Privacy Policy | Toty Sport"}
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
