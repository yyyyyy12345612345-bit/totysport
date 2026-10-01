"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageCircle, Award } from "lucide-react";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { useLanguage } from "@/features/language/LanguageProvider";

export default function AboutPage() {
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

  const storyTag = isAr ? "قصتنا ورؤيتنا" : "Our Story & Vision";
  const aboutTitle = isAr ? "عن براند توتي سبورت" : "About Toty Sport";
  const aboutSubtitle = isAr
    ? "البراند الرائد للتيشرتات الرياضية الفاخرة وأطقم الأندية العالمية في مصر، خامات تتنفس مطابقة لأطقم الملاعب."
    : "Egypt's premier brand for authentic player-version football kits and athletic wear with breathable match-grade fabrics.";

  const section1Title = isAr ? "شغف كروي لا ينتهي" : "Unmatched Football Passion";
  const section1Text = isAr
    ? "في توتي سبورت، نؤمن بأن التيشرت الرياضي ليس مجرد قطعة قماش، بل هوية وانتماء وشغف يعيشه كل عاشق للساحرة المستديرة. نحرص على انتقاء أدق التفاصيل وتوفير أقوى إصدارات أندية ومنتخبات العالم بأعلى درجات الجودة ومطابقة تامة للأطقم الأصلية."
    : "At Toty Sport, we believe a football jersey is more than fabric—it is passion, identity, and loyalty. We obsess over the finest details to deliver player-version club and national kits crafted to authentic match-grade specifications.";

  const section2Title = isAr ? "جودة احترافية ومعاينة قبل الاستلام" : "Match-Grade Quality & Inspection";
  const section2Text = isAr
    ? "نوفر لعملائنا في القاهرة وجميع محافظات مصر تجربة تسوق راقية تشمل خامات رياضية مريحة وعالية التهوية، مع إمكانية فحص ومعاينة المنتج بالكامل مع مندوب الشحن قبل سداد أي مبلغ، لأن ثقتكم هي رأس مالنا."
    : "We offer sports enthusiasts across Cairo and all Egyptian governorates a first-class shopping experience: breathable performance fabrics, fast delivery, and full inspection on delivery before payment.";

  const features = [
    {
      icon: Award,
      title: isAr ? "أعلى جودة في مصر" : "Match-Grade Quality",
      desc: isAr ? "خامات وتطريزات وشعارات مطابقة لنسخ اللاعبين" : "Player-version fabrics, badges, and embroidered details",
    },
    {
      icon: ShieldCheck,
      title: isAr ? "معاينة قبل الدفع" : "Inspect On Delivery",
      desc: isAr ? "افحص التيشرت وتأكد من الجودة والمقاس قبل الاستلام" : "Verify fabric and size with the courier before paying",
    },
    {
      icon: Truck,
      title: isAr ? "توصيل لكافة المحافظات" : "Fast Egypt-wide Shipping",
      desc: isAr ? "شحن آمن وسريع من القاهرة لجميع أنحاء الجمهورية" : "Swift and insured delivery from Cairo to all governorates",
    },
    {
      icon: MessageCircle,
      title: isAr ? "دعم مباشر وسريع" : "Direct WhatsApp Support",
      desc: isAr ? "فريق عمل متواجد دائماً لمساعدتك في اختيار مقاسك" : "Always available via WhatsApp to help you pick the right fit",
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-black text-foreground transition-colors duration-300 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-zinc-900 dark:text-[#ccff00] text-xs font-black tracking-wide mb-3">
            <span>{storyTag}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {aboutTitle}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {aboutSubtitle}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-[#ccff00]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-black text-[#ccff00] flex items-center justify-center mb-3 shadow-md">
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-sm text-foreground mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 shadow-sm"
          >
            <h2 className="text-2xl font-black mb-3 text-foreground">{section1Title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base font-normal">
              {section1Text}
            </p>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 shadow-sm"
          >
            <h2 className="text-2xl font-black mb-3 text-foreground">{section2Title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base font-normal">
              {section2Text}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
