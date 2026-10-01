"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Suspense } from "react";

import { useLanguage } from "@/features/language/LanguageProvider";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { t, isRTL } = useLanguage();

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Success Icon */}
        <motion.div
          className="w-20 h-20 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
        >
          <CheckCircle className="text-green-600 dark:text-green-400" size={36} />
        </motion.div>

        <motion.h1
          className="text-3xl font-extrabold mb-3 text-zinc-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t("orderSuccess.title")}
        </motion.h1>

        <motion.p
          className="text-zinc-500 dark:text-zinc-400 mb-2 text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {t("orderSuccess.subtitle")}
        </motion.p>

        {orderId && (
          <motion.div
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 mb-6 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-zinc-400 mb-1">{t("orderSuccess.orderId")}</p>
            <p className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-wider">
              #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </motion.div>
        )}

        <motion.div
          className={`bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 mb-8 ${isRTL ? "text-right" : "text-left"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <Package className="text-lime-500 dark:text-lime-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="font-bold text-sm mb-2 text-zinc-900 dark:text-white">{t("orderSuccess.whatsNext")}</p>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 leading-relaxed font-medium">
                <li>{t("orderSuccess.step1")}</li>
                <li>{t("orderSuccess.step2")}</li>
                <li>{t("orderSuccess.step3")}</li>
                <li>{t("orderSuccess.step4")}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8e600] transition-colors shadow-md"
          >
            {t("orderSuccess.continue")}
            <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {t("orderSuccess.goHome")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
