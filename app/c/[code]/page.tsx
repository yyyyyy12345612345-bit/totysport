"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCampaignBySlug } from "@/lib/firebase/firestore";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CampaignRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const rawCode = Array.isArray(params?.code) ? params.code[0] : (params?.code as string) || "";
  const [error, setError] = useState<string | null>(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    let cleanCode = "";
    try {
      cleanCode = decodeURIComponent(rawCode).trim().toLowerCase();
    } catch {
      cleanCode = rawCode.trim().toLowerCase();
    }

    if (!cleanCode) {
      router.replace("/");
      return;
    }

    let isMounted = true;

    // Safety timeout: Never let the customer wait more than 1.8 seconds under any network circumstance
    const timeoutId = setTimeout(() => {
      if (isMounted && !redirectedRef.current) {
        redirectedRef.current = true;
        window.location.replace("/");
      }
    }, 1800);

    async function handleRedirect() {
      try {
        const campaign = await getCampaignBySlug(cleanCode);

        if (!isMounted || redirectedRef.current) return;
        clearTimeout(timeoutId);

        if (!campaign) {
          // If campaign slug not found, redirect to store home
          setError("لم يتم العثور على هذا الرابط، جاري نقلك للمتجر...");
          setTimeout(() => {
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              router.replace("/");
            }
          }, 1000);
          return;
        }

        if (campaign.status === "paused") {
          setError("هذا العرض متوقف حالياً، جاري نقلك للمتجر...");
          setTimeout(() => {
            if (!redirectedRef.current) {
              redirectedRef.current = true;
              router.replace("/");
            }
          }, 1000);
          return;
        }

        // Store campaign attribution in sessionStorage for persistent funnel tracking
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("nxt_campaign_id", campaign.id);
            sessionStorage.setItem("nxt_campaign_name", campaign.name);
            sessionStorage.setItem("nxt_campaign_source", campaign.platform || "Direct");
            sessionStorage.setItem("nxt_campaign_medium", campaign.medium || "link");
            if (campaign.targetProductId) {
              sessionStorage.setItem("nxt_campaign_product_id", campaign.targetProductId);
            }
            if (campaign.targetProductName) {
              sessionStorage.setItem("nxt_campaign_product_name", campaign.targetProductName);
            }
            sessionStorage.setItem("nxt_is_campaign", "1");
            window.dispatchEvent(new Event("nxt_url_changed"));
          } catch (e) {
            console.error("Failed to set session storage:", e);
          }
        }

        // Construct clean target URL with tracking parameters
        const qParams = new URLSearchParams();
        qParams.set("utm_campaign", campaign.name);
        qParams.set("utm_source", campaign.platform || "Direct");
        qParams.set("utm_medium", campaign.medium || "link");
        qParams.set("camp_id", campaign.id);

        let targetPath = "/";
        if (campaign.targetType === "product" && campaign.targetProductId) {
          qParams.set("id", campaign.targetProductId);
          targetPath = `/products?${qParams.toString()}`;
        } else {
          targetPath = `/?${qParams.toString()}`;
        }

        redirectedRef.current = true;

        // Instant navigation via router with window.location fallback
        router.replace(targetPath);
        setTimeout(() => {
          if (window.location.pathname.startsWith("/c/")) {
            window.location.replace(targetPath);
          }
        }, 300);
      } catch (err) {
        console.error("Campaign redirect error:", err);
        if (isMounted && !redirectedRef.current) {
          redirectedRef.current = true;
          window.location.replace("/");
        }
      }
    }

    handleRedirect();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [rawCode, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-4 text-center select-none transition-colors">
      <div className="flex flex-col items-center max-w-xs w-full p-6 space-y-4">
        {error ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-bold leading-relaxed">
              {error}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              <span>الانتقال للمتجر الآن</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
              Luno Store
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
