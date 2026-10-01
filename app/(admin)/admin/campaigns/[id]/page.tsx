"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  Smartphone,
  Monitor,
  Tablet,
  DollarSign,
  X,
  Sparkles,
} from "lucide-react";
import {
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  subscribeToVisitorSessions,
  getTimestampMs,
  type AdCampaign,
  type VisitorAnalyticsSummary,
  type VisitorSession,
} from "@/lib/firebase/firestore";
import { useAuth } from "@/features/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function SingleCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "";
  const { user, loading: authLoading } = useAuth();

  const [campaign, setCampaign] = useState<AdCampaign | null>(null);
  const [analyticsData, setAnalyticsData] = useState<VisitorAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Copy states
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editPlatform, setEditPlatform] = useState("");
  const [editMedium, setEditMedium] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "paused" | "completed">("active");
  const [editBudget, setEditBudget] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load campaign & subscribe to sessions
  useEffect(() => {
    if (authLoading || !user || !campaignId) return;

    let isMounted = true;

    async function loadData() {
      try {
        const camp = await getCampaignById(campaignId);
        if (!isMounted) return;

        if (!camp) {
          toast.error("لم يتم العثور على هذه الحملة");
          router.replace("/admin/campaigns");
          return;
        }

        setCampaign(camp);
        setEditName(camp.name);
        setEditSlug(camp.slug);
        setEditPlatform(camp.platform);
        setEditMedium(camp.medium);
        setEditStatus(camp.status);
        setEditBudget(camp.budget ? String(camp.budget) : "");
        setEditNotes(camp.notes || "");
      } catch (err) {
        console.error("Error loading campaign:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    const unsubVis = subscribeToVisitorSessions((sum) => {
      if (isMounted) setAnalyticsData(sum);
    });

    return () => {
      isMounted = false;
      unsubVis();
    };
  }, [campaignId, authLoading, user, router]);

  // Host origin
  const origin = useMemo(() => {
    if (typeof window !== "undefined") return window.location.origin;
    return "https://totysport.com";
  }, []);

  // Short URL and Full URL
  const shortUrl = useMemo(() => {
    if (!campaign) return "";
    return `${origin}/c/${campaign.slug}`;
  }, [origin, campaign]);

  const fullTrackingUrl = useMemo(() => {
    if (!campaign) return "";
    const qParams = new URLSearchParams();
    qParams.set("utm_campaign", campaign.name);
    qParams.set("utm_source", campaign.platform || "Direct");
    qParams.set("utm_medium", campaign.medium || "link");
    qParams.set("camp_id", campaign.id);

    if (campaign.targetType === "product" && campaign.targetProductId) {
      qParams.set("id", campaign.targetProductId);
      return `${origin}/products?${qParams.toString()}`;
    }
    return `${origin}/?${qParams.toString()}`;
  }, [origin, campaign]);

  // Filter sessions matching this campaign
  const campaignSessions = useMemo<VisitorSession[]>(() => {
    if (!analyticsData?.sessions || !campaign) return [];

    return analyticsData.sessions.filter((s) => {
      if (!s.isFromCampaign) return false;
      if (s.campaignId && s.campaignId === campaign.id) return true;
      if (s.campaignName) {
        if (s.campaignName === campaign.name) return true;
        if (s.campaignName.toLowerCase() === campaign.slug.toLowerCase()) return true;
      }
      return false;
    });
  }, [analyticsData, campaign]);

  // Detailed Telemetry
  const stats = useMemo(() => {
    const totalVisits = campaignSessions.length;
    const uniqueIds = new Set<string>();
    let productViews = 0;
    let reachedCart = 0;
    let reachedCheckout = 0;
    let convertedOrders = 0;
    let liveCount = 0;

    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    const browserCounts: Record<string, number> = {};

    const now = Date.now();
    const liveWindow = 5 * 60 * 1000;

    campaignSessions.forEach((s) => {
      if (s.visitorId) uniqueIds.add(s.visitorId);

      // Funnel Stages
      if (s.maxStageRank >= 2 || s.maxStage === "product") productViews++;
      if (s.maxStageRank >= 3 || s.maxStage === "cart") reachedCart++;
      if (s.maxStageRank >= 4 || s.maxStage === "checkout") reachedCheckout++;
      if (s.maxStageRank >= 5 || s.maxStage === "order_success") convertedOrders++;

      // Device
      if (s.device === "Mobile") deviceCounts.mobile++;
      else if (s.device === "Tablet") deviceCounts.tablet++;
      else deviceCounts.desktop++;

      // Browser
      const b = s.browser || "Unknown";
      browserCounts[b] = (browserCounts[b] || 0) + 1;

      // Live status
      const updatedMs = s.updatedAtMs || getTimestampMs(s.lastActive) || 0;
      if (now - updatedMs <= liveWindow && updatedMs > 0) {
        liveCount++;
      }
    });

    const uniqueCount = uniqueIds.size || (totalVisits > 0 ? 1 : 0);
    const convRate = totalVisits > 0 ? Math.round((convertedOrders / (uniqueCount || totalVisits)) * 100) : 0;
    const checkoutDropRate =
      reachedCheckout > 0
        ? Math.round(((reachedCheckout - convertedOrders) / reachedCheckout) * 100)
        : 0;

    // Financials
    const budget = campaign?.budget || 0;
    const costPerVisit = budget > 0 && totalVisits > 0 ? (budget / totalVisits).toFixed(2) : null;
    const costPerOrder = budget > 0 && convertedOrders > 0 ? (budget / convertedOrders).toFixed(2) : null;

    return {
      totalVisits,
      uniqueVisitors: uniqueCount,
      productViews,
      reachedCart,
      reachedCheckout,
      convertedOrders,
      convRate: Math.min(convRate, 100),
      checkoutDropRate: Math.max(checkoutDropRate, 0),
      liveCount,
      deviceCounts,
      browserCounts,
      budget,
      costPerVisit,
      costPerOrder,
    };
  }, [campaignSessions, campaign]);

  // Copy helpers
  const handleCopyShort = () => {
    if (navigator.clipboard && shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopiedShort(true);
      toast.success("تم نسخ الرابط القصير للحافظة!");
      setTimeout(() => setCopiedShort(false), 2000);
    }
  };

  const handleCopyFull = () => {
    if (navigator.clipboard && fullTrackingUrl) {
      navigator.clipboard.writeText(fullTrackingUrl);
      setCopiedFull(true);
      toast.success("تم نسخ الرابط الكامل مع معلمات الـ UTM!");
      setTimeout(() => setCopiedFull(false), 2000);
    }
  };

  // Toggle status
  const handleToggleStatus = async () => {
    if (!campaign) return;
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      await updateCampaign(campaign.id, { status: newStatus });
      setCampaign((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(newStatus === "active" ? "تم تفعيل الحملة" : "تم إيقاف الحملة مؤقتاً");
    } catch {
      toast.error("فشل تغيير حالة الحملة");
    }
  };

  // Save edit form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign || !editName.trim()) return;

    const cleanSlug = editSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    setIsSaving(true);
    try {
      await updateCampaign(campaign.id, {
        name: editName.trim(),
        slug: cleanSlug,
        platform: editPlatform,
        medium: editMedium,
        status: editStatus,
        budget: editBudget ? parseFloat(editBudget) : undefined,
        notes: editNotes.trim() || undefined,
      });

      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              name: editName.trim(),
              slug: cleanSlug,
              platform: editPlatform,
              medium: editMedium,
              status: editStatus,
              budget: editBudget ? parseFloat(editBudget) : undefined,
              notes: editNotes.trim() || undefined,
            }
          : null
      );

      toast.success("تم حفظ إعدادات الحملة بنجاح!");
      setEditModalOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!campaign) return;
    if (confirm(`هل أنت متأكد من حذف هذه الحملة الإعلانية نهائياً؟`)) {
      try {
        await deleteCampaign(campaign.id);
        toast.success("تم حذف الحملة");
        router.replace("/admin/campaigns");
      } catch {
        toast.error("فشل حذف الحملة");
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-zinc-500 font-bold">جاري تحميل إحصائيات الحملة...</p>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Bar with Back Link ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowRight size={16} />
          <span>العودة لجميع الحملات</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              campaign.status === "active"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                campaign.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{campaign.status === "active" ? "الحملة نشطة وتستقبل زوار" : "الحملة متوقفة مؤقتاً"}</span>
          </button>

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm"
            title="تعديل الإعدادات"
          >
            <Edit3 size={15} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shadow-sm"
            title="حذف الحملة"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ── Main Campaign Header Card (Clean White Mode) ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-6 text-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {campaign.platform}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-100 text-zinc-600 border border-zinc-200">
                {campaign.medium}
              </span>
              {stats.liveCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{stats.liveCount} زائر مباشر الآن من الإعلان</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-zinc-900">{campaign.name}</h1>

            {campaign.notes && (
              <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">{campaign.notes}</p>
            )}
          </div>

          {/* Target Box */}
          <div className="shrink-0 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex items-center gap-3.5">
            {campaign.targetType === "product" ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-zinc-200 overflow-hidden relative shrink-0 border border-zinc-300">
                  <Image
                    src={campaign.targetProductImage || "/placeholder.jpg"}
                    alt={campaign.targetProductName || "منتج"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 block uppercase tracking-wider">
                    المنتج المستهدف بالإعلان
                  </span>
                  <p className="text-xs font-bold text-zinc-900 max-w-[180px] truncate">
                    {campaign.targetProductName || "منتج المتجر"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                  <Globe size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                    الوجهة المستهدفة
                  </span>
                  <p className="text-xs font-bold text-zinc-900">المتجر ككل (الصفحة الرئيسية)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Link Box (Short & Full) ── */}
        <div className="pt-5 border-t border-zinc-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1. Short Clean Link */}
          <div className="bg-amber-50/40 border border-amber-200/70 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>الرابط القصير الذكي (لإعلاناتك وبايو الحساب):</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">جاهز وموثوق للعملاء</span>
            </div>

            <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl p-2.5 shadow-sm">
              <span className="flex-1 font-mono text-xs text-zinc-800 font-bold truncate dir-ltr select-all">
                {shortUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyShort}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                {copiedShort ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedShort ? "تم النسخ!" : "نسخ"}</span>
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs transition-colors shrink-0"
                title="فتح الرابط وتجربته"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">
              يعيد التوجيه في جزء من الثانية مع حقن معلمات التتبع في جلسة العميل بدقة.
            </p>
          </div>

          {/* 2. Full UTM Tracking URL */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700">
                الرابط الكامل بمعلمات التتبع (Full UTM URL):
              </span>
              <span className="text-[10px] text-zinc-400">للاستخدام المباشر في منصات الإعلانات</span>
            </div>

            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl p-2.5 shadow-sm">
              <span className="flex-1 font-mono text-[11px] text-zinc-600 truncate dir-ltr select-all">
                {fullTrackingUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyFull}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedFull ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedFull ? "تم!" : "نسخ"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Grid (Clean White Mode) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Visits */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-zinc-500 font-bold block">الزيارات الفعلية</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-blue-600">{stats.totalVisits}</h3>
            <span className="text-xs text-blue-600/70 font-bold">نقرة</span>
          </div>
          <p className="text-[10px] text-zinc-400">إجمالي فتحات الرابط</p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-zinc-500 font-bold block">زوار فريدون</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-zinc-900">{stats.uniqueVisitors}</h3>
            <span className="text-xs text-zinc-400 font-bold">شخص</span>
          </div>
          <p className="text-[10px] text-zinc-400">بدون تكرار لنفس الزائر</p>
        </div>

        {/* Reached Cart */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-amber-600 font-bold block">أضافوا للسلة</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-amber-600">{stats.reachedCart}</h3>
            <span className="text-xs text-amber-600/70 font-bold">عميل</span>
          </div>
          <p className="text-[10px] text-zinc-400">تفاعلوا مع زر الشراء</p>
        </div>

        {/* Reached Checkout */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-purple-600 font-bold block">وصلوا للشيك أوت</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-purple-600">{stats.reachedCheckout}</h3>
            <span className="text-xs text-purple-600/70 font-bold">عميل</span>
          </div>
          <p className="text-[10px] text-zinc-400">فتحوا صفحة إتمام الطلب</p>
        </div>

        {/* Converted Orders */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-emerald-600 font-bold block">الطلبات المكتملة</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-emerald-600">{stats.convertedOrders}</h3>
            <span className="text-xs text-emerald-600/70 font-bold">طلب مؤكد</span>
          </div>
          <p className="text-[10px] text-zinc-400">مبيعات ناتجة عن الإعلان</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1">
          <span className="text-xs text-emerald-600 font-bold block">معدل التحويل (Conv)</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-emerald-600">{stats.convRate}%</h3>
          </div>
          <p className="text-[10px] text-zinc-400">نسبة الشراء من الزوار</p>
        </div>
      </div>

      {/* ── Financials Card (If budget is set) ── */}
      {stats.budget > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-amber-500" />
            <h3 className="text-sm font-black text-zinc-900">
              تحليل التكلفة والميزانية المرصودة للحملة
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs text-zinc-500 font-bold block mb-1">الميزانية المخصصة</span>
              <h4 className="text-xl font-black text-zinc-900">
                {formatPrice(stats.budget)}
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs text-zinc-500 font-bold block mb-1">
                تكلفة النقرة / الزيارة (CPV)
              </span>
              <h4 className="text-xl font-black text-blue-600">
                {stats.costPerVisit ? `${stats.costPerVisit} ج.م` : "غير متوفر بعد"}
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs text-zinc-500 font-bold block mb-1">
                تكلفة الاستحواذ على الطلب (CPA)
              </span>
              <h4 className="text-xl font-black text-emerald-600">
                {stats.costPerOrder ? `${stats.costPerOrder} ج.م` : "بانتظار أول أوردر"}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* ── Visual Conversion Funnel (Clean White Mode) ── */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-black text-zinc-900">
            قمع التحويل البيعي للحملة (Campaign Purchase Funnel)
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            تتبع تسرب الزوار ومراحل تقدمهم خطوة بخطوة من النقر على الإعلان وحتى تأكيد الشراء
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1: Visits */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-zinc-800">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>زيارة الإعلان (Visits)</span>
              </span>
              <span className="text-blue-600">{stats.totalVisits} زيارة (100%)</span>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-full" />
            </div>
          </div>

          {/* Step 2: Reached Cart */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-zinc-800">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>الإضافة للسلة (Added to Cart)</span>
              </span>
              <span className="text-amber-600">
                {stats.reachedCart} عميل (
                {stats.totalVisits > 0
                  ? Math.round((stats.reachedCart / stats.totalVisits) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalVisits > 0
                      ? Math.min((stats.reachedCart / stats.totalVisits) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Step 3: Reached Checkout */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-zinc-800">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>الوصول لصفحة الدفع (Reached Checkout)</span>
              </span>
              <span className="text-purple-600">
                {stats.reachedCheckout} عميل (
                {stats.totalVisits > 0
                  ? Math.round((stats.reachedCheckout / stats.totalVisits) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalVisits > 0
                      ? Math.min((stats.reachedCheckout / stats.totalVisits) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Step 4: Completed Order */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-zinc-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
                  4
                </span>
                <span>إتمام الشراء بنجاح (Order Converted)</span>
              </span>
              <span className="text-emerald-600">
                {stats.convertedOrders} طلب ({stats.convRate}%)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalVisits > 0
                      ? Math.min((stats.convertedOrders / stats.totalVisits) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Devices & Live Visitors Table (Clean White Mode) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-zinc-900">
            توزيع أجهزة الزوار للإعلان
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2.5">
                <Smartphone size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-zinc-700">موبايل</span>
              </div>
              <span className="text-xs font-black text-zinc-900">
                {stats.deviceCounts.mobile} زيارة
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2.5">
                <Monitor size={16} className="text-purple-500" />
                <span className="text-xs font-bold text-zinc-700">كمبيوتر</span>
              </div>
              <span className="text-xs font-black text-zinc-900">
                {stats.deviceCounts.desktop} زيارة
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2.5">
                <Tablet size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-zinc-700">تابلت</span>
              </div>
              <span className="text-xs font-black text-zinc-900">
                {stats.deviceCounts.tablet} زيارة
              </span>
            </div>
          </div>
        </div>

        {/* Live Visitor Sessions Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-zinc-900">
                سجل زوار هذه الحملة ({campaignSessions.length})
              </h3>
              <p className="text-[11px] text-zinc-500">
                العملاء الذين زاروا المتجر عبر هذا الإعلان تحديداً
              </p>
            </div>
          </div>

          {campaignSessions.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              لم تسجل هذه الحملة أي زيارات بعد. قم بنسخ الرابط القصير بالأعلى وجربه!
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">الجهاز والصفحة</th>
                    <th className="py-2.5 px-3">أقصى مرحلة وصل إليها</th>
                    <th className="py-2.5 px-3">التواجد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {campaignSessions.slice(0, 20).map((s) => {
                    const now = Date.now();
                    const isLive = now - (s.updatedAtMs || getTimestampMs(s.lastActive) || 0) <= 5 * 60 * 1000;

                    return (
                      <tr key={s.id} className="hover:bg-zinc-50/70">
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-800">
                              {s.device} • {s.browser}
                            </span>
                            <span className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                              {s.currentPage}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.maxStageRank >= 5
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : s.maxStageRank === 4
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : s.maxStageRank === 3
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                            }`}
                          >
                            {s.maxStageLabel || "تصفح عام"}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>مباشر الآن</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400">غادر المتجر</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT SETTINGS MODAL (Clean White Mode) ── */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 overflow-hidden my-8 text-zinc-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-900">
                      تعديل إعدادات الحملة
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      تحديث الاسم، الكود القصير، أو الميزانية
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    اسم الحملة:
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    الكود القصير للرابط (Slug):
                  </label>
                  <div className="flex items-center gap-1.5 dir-ltr bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                    <span className="text-zinc-400 font-mono text-xs shrink-0">
                      {origin.replace(/^https?:\/\//, "")}/c/
                    </span>
                    <input
                      type="text"
                      required
                      value={editSlug}
                      onChange={(e) =>
                        setEditSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, "-")
                        )
                      }
                      className="flex-1 bg-transparent text-zinc-900 font-mono font-bold text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      المنصة:
                    </label>
                    <input
                      type="text"
                      value={editPlatform}
                      onChange={(e) => setEditPlatform(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      نوع الإعلان:
                    </label>
                    <input
                      type="text"
                      value={editMedium}
                      onChange={(e) => setEditMedium(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      الميزانية (ج.م):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      الحالة:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-bold focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="active">نشطة</option>
                      <option value="paused">متوقفة مؤقتاً</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    ملاحظات:
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <Spinner size="sm" />}
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
