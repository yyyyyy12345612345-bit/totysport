"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Package,
  Trash2,
  Edit3,
  BarChart3,
  X,
  ArrowRight,
} from "lucide-react";
import {
  subscribeCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  subscribeToVisitorSessions,
  getProducts,
  type AdCampaign,
  type VisitorAnalyticsSummary,
} from "@/lib/firebase/firestore";
import type { Product } from "@/types/product";
import { useAuth } from "@/features/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const PLATFORMS = [
  "TikTok",
  "Instagram",
  "Facebook",
  "Snapchat",
  "Google",
  "WhatsApp",
  "Influencer",
  "Other",
];

const MEDIUMS = [
  { id: "video_ad", label: "فيديو إعلاني (Video Ad)" },
  { id: "reels", label: "ريلز (Reels)" },
  { id: "story", label: "ستوري (Story)" },
  { id: "cpc", label: "نقرات ممولة (CPC)" },
  { id: "post", label: "منشور (Post)" },
  { id: "bio", label: "رابط البايو (Bio Link)" },
];

export default function AdminCampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [analyticsData, setAnalyticsData] = useState<VisitorAnalyticsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [targetFilter, setTargetFilter] = useState<"all" | "website" | "product">("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTargetType, setFormTargetType] = useState<"website" | "product">("product");
  const [formProductId, setFormProductId] = useState("");
  const [formPlatform, setFormPlatform] = useState("TikTok");
  const [formMedium, setFormMedium] = useState("video_ad");
  const [formStatus, setFormStatus] = useState<"active" | "paused" | "completed">("active");
  const [formBudget, setFormBudget] = useState<string>("");
  const [formNotes, setFormNotes] = useState("");

  // Subscriptions
  useEffect(() => {
    if (authLoading || !user) return;

    const unsubCamp = subscribeCampaigns((list) => {
      setCampaigns(list);
      setLoading(false);
    });

    const unsubVis = subscribeToVisitorSessions((sum) => {
      setAnalyticsData(sum);
    });

    getProducts()
      .then((prods) => {
        setProducts(prods);
        if (prods.length > 0) {
          setFormProductId((prev) => prev || prods[0].id);
        }
      })
      .catch((err) => console.error("Error loading products:", err));

    return () => {
      unsubCamp();
      unsubVis();
    };
  }, [authLoading, user]);

  // Host origin for links
  const origin = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://totysport.com";
  }, []);

  // Compute metrics per campaign from sessions
  const campaignMetricsMap = useMemo(() => {
    const map: Record<
      string,
      {
        totalVisits: number;
        uniqueVisitors: Set<string>;
        reachedCart: number;
        reachedCheckout: number;
        convertedOrders: number;
      }
    > = {};

    if (!analyticsData?.sessions) return map;

    analyticsData.sessions.forEach((s) => {
      if (!s.isFromCampaign) return;

      campaigns.forEach((camp) => {
        const isMatch =
          (s.campaignId && s.campaignId === camp.id) ||
          (s.campaignName &&
            (s.campaignName === camp.name ||
              s.campaignName.toLowerCase() === camp.slug.toLowerCase()));

        if (isMatch) {
          if (!map[camp.id]) {
            map[camp.id] = {
              totalVisits: 0,
              uniqueVisitors: new Set(),
              reachedCart: 0,
              reachedCheckout: 0,
              convertedOrders: 0,
            };
          }
          const m = map[camp.id];
          m.totalVisits += 1;
          if (s.visitorId) m.uniqueVisitors.add(s.visitorId);
          if (s.maxStageRank >= 3 || s.maxStage === "cart") m.reachedCart += 1;
          if (s.maxStageRank >= 4 || s.maxStage === "checkout") m.reachedCheckout += 1;
          if (s.maxStageRank >= 5 || s.maxStage === "order_success") m.convertedOrders += 1;
        }
      });
    });

    return map;
  }, [analyticsData, campaigns]);

  // Global KPIs
  const globalKpis = useMemo(() => {
    const totalCount = campaigns.length;
    const activeCount = campaigns.filter((c) => c.status === "active").length;

    let totalVisits = 0;
    let totalOrders = 0;
    let totalReachedCheckout = 0;

    Object.values(campaignMetricsMap).forEach((m) => {
      totalVisits += m.totalVisits;
      totalOrders += m.convertedOrders;
      totalReachedCheckout += m.reachedCheckout;
    });

    const avgConv = totalVisits > 0 ? Math.round((totalOrders / totalVisits) * 100) : 0;

    return {
      totalCount,
      activeCount,
      totalVisits,
      totalOrders,
      totalReachedCheckout,
      avgConv,
    };
  }, [campaigns, campaignMetricsMap]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = camp.name?.toLowerCase().includes(q);
        const matchSlug = camp.slug?.toLowerCase().includes(q);
        const matchProduct = camp.targetProductName?.toLowerCase().includes(q);
        const matchPlatform = camp.platform?.toLowerCase().includes(q);
        if (!matchName && !matchSlug && !matchProduct && !matchPlatform) return false;
      }

      if (platformFilter !== "all" && camp.platform !== platformFilter) return false;
      if (statusFilter !== "all" && camp.status !== statusFilter) return false;
      if (targetFilter !== "all" && camp.targetType !== targetFilter) return false;

      return true;
    });
  }, [campaigns, searchQuery, platformFilter, statusFilter, targetFilter]);

  // Handle open create modal
  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setFormName("");
    setFormSlug("");
    setFormTargetType("product");
    setFormProductId(products[0]?.id || "");
    setFormPlatform("TikTok");
    setFormMedium("video_ad");
    setFormStatus("active");
    setFormBudget("");
    setFormNotes("");
    setModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (camp: AdCampaign) => {
    setEditingCampaign(camp);
    setFormName(camp.name);
    setFormSlug(camp.slug);
    setFormTargetType(camp.targetType || "product");
    setFormProductId(camp.targetProductId || products[0]?.id || "");
    setFormPlatform(camp.platform || "TikTok");
    setFormMedium(camp.medium || "video_ad");
    setFormStatus(camp.status || "active");
    setFormBudget(camp.budget ? String(camp.budget) : "");
    setFormNotes(camp.notes || "");
    setModalOpen(true);
  };

  // Auto-generate slug when name changes in create mode
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCampaign) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9\u0621-\u064A-]/g, "")
        .replace(/--+/g, "-")
        .slice(0, 30);
      setFormSlug(generated || `c-${Date.now().toString(36).slice(-4)}`);
    }
  };

  // Handle Save Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("يرجى إدخال اسم الحملة");
      return;
    }

    const cleanSlug =
      formSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") ||
      `c-${Date.now().toString(36)}`;

    // Check slug uniqueness
    const existing = campaigns.find(
      (c) => c.slug.toLowerCase() === cleanSlug && c.id !== editingCampaign?.id
    );
    if (existing) {
      toast.error("هذا الكود القصير مستخدم بالفعل في حملة أخرى، اختر كوداً مختلفاً");
      return;
    }

    setIsSubmitting(true);
    try {
      let prodName: string | undefined;
      let prodImg: string | undefined;

      if (formTargetType === "product" && formProductId) {
        const found = products.find((p) => p.id === formProductId);
        if (found) {
          prodName = found.name;
          prodImg = found.mainImage || "";
        }
      }

      const campaignPayload = {
        name: formName.trim(),
        slug: cleanSlug,
        targetType: formTargetType,
        targetProductId: formTargetType === "product" ? formProductId : undefined,
        targetProductName: formTargetType === "product" ? prodName : undefined,
        targetProductImage: formTargetType === "product" ? prodImg : undefined,
        platform: formPlatform,
        medium: formMedium,
        status: formStatus,
        budget: formBudget ? parseFloat(formBudget) : undefined,
        notes: formNotes.trim() || undefined,
      };

      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, campaignPayload);
        toast.success("تم تحديث إعدادات الحملة بنجاح!");
      } else {
        await createCampaign(campaignPayload);
        toast.success("تم إنشاء الحملة وتوليد الرابط القصير بنجاح!");
      }

      setModalOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء حفظ الحملة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick toggle status
  const handleToggleStatus = async (camp: AdCampaign) => {
    const newStatus = camp.status === "active" ? "paused" : "active";
    try {
      await updateCampaign(camp.id, { status: newStatus });
      toast.success(newStatus === "active" ? "تم تفعيل الحملة" : "تم إيقاف الحملة مؤقتاً");
    } catch {
      toast.error("فشل تغيير حالة الحملة");
    }
  };

  // Delete campaign
  const handleDelete = async (camp: AdCampaign) => {
    if (confirm(`هل أنت متأكد من حذف الحملة "${camp.name}"؟`)) {
      try {
        await deleteCampaign(camp.id);
        toast.success("تم حذف الحملة بنجاح");
      } catch {
        toast.error("فشل حذف الحملة");
      }
    }
  };

  // Copy Short Link
  const handleCopyShortLink = (slug: string) => {
    const shortUrl = `${origin}/c/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
      setCopiedSlug(slug);
      toast.success("تم نسخ الرابط القصير للحافظة!");
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-zinc-500 font-bold">جاري تحميل منظومة الحملات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Header Banner (Clean White Mode) ── */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold w-fit">
            <Megaphone size={14} className="text-amber-600" />
            <span>نظام إدارة الحملات الترويجية والروابط المختصرة</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
            الحملات الإعلانية ومتابعة العائد
          </h1>
          <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
            أنشئ روابط قصيرة ذكية وموثوقة لمتجرك أو لمنتجاتك المحددة، تتبع نقرات وزيارات إعلاناتك على تيك توك وإنستجرام، واعرف بدقة الأوردرات ونسبة التحويل الناتجة عن كل حملة.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>إنشاء حملة جديدة</span>
        </button>
      </div>

      {/* ── KPI Overview Grid (Clean White Mode) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Campaigns */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-zinc-500 block">إجمالي الحملات</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-zinc-900">
              {globalKpis.totalCount}
            </h3>
            <span className="text-xs text-zinc-500 font-bold">حملة</span>
          </div>
          <p className="text-[10px] text-zinc-400">تم إنشاؤها في المتجر</p>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-emerald-600 block">الحملات النشطة</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-emerald-600">
              {globalKpis.activeCount}
            </h3>
            <span className="text-xs text-emerald-600/70 font-bold">نشطة الآن</span>
          </div>
          <p className="text-[10px] text-zinc-400">تستقبل نقرات الزوار</p>
        </div>

        {/* Total Visits */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-blue-600 block">إجمالي الزيارات</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-blue-600">
              {globalKpis.totalVisits}
            </h3>
            <span className="text-xs text-blue-600/70 font-bold">زيارة</span>
          </div>
          <p className="text-[10px] text-zinc-400">دخلوا عبر الروابط</p>
        </div>

        {/* Reached Checkout */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-purple-600 block">وصلوا للشيك أوت</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-purple-600">
              {globalKpis.totalReachedCheckout}
            </h3>
            <span className="text-xs text-purple-600/70 font-bold">عميل</span>
          </div>
          <p className="text-[10px] text-zinc-400">خطوة الدفع الجادة</p>
        </div>

        {/* Converted Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-emerald-600 block">الأوردرات المكتملة</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-emerald-600">
              {globalKpis.totalOrders}
            </h3>
            <span className="text-xs text-emerald-600/70 font-bold">طلب ناجح</span>
          </div>
          <p className="text-[10px] text-zinc-400">مبيعات تمت بنجاح</p>
        </div>

        {/* Avg Conv Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-1 hover:border-zinc-300 transition-colors">
          <span className="text-[11px] font-bold text-amber-600 block">متوسط التحويل</span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-black text-amber-600">
              {globalKpis.avgConv}%
            </h3>
            <span className="text-xs text-amber-600/70 font-bold">Conv. Rate</span>
          </div>
          <p className="text-[10px] text-zinc-400">نسبة المبيعات للزيارات</p>
        </div>
      </div>

      {/* ── Filters & Search Bar (Clean White Mode) ── */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الحملة، الكود القصير، اسم المنتج، أو المنصة..."
              className="w-full pl-4 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:bg-white focus:border-amber-500 focus:outline-none transition-colors placeholder:text-zinc-400"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 focus:outline-none cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة فقط</option>
              <option value="paused">متوقفة فقط</option>
            </select>

            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 focus:outline-none cursor-pointer"
            >
              <option value="all">جميع الوجهات</option>
              <option value="product">منتج محدد</option>
              <option value="website">المتجر ككل</option>
            </select>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 focus:outline-none cursor-pointer"
            >
              <option value="all">جميع المنصات</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Campaigns Table (Clean White Mode) ── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-zinc-900">
              قائمة الحملات الإعلانية ({filteredCampaigns.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              انقر على أي حملة للاطلاع على إحصائياتها الكاملة أو اضغط نسخ لمشاركة الرابط القصير
            </p>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3.5 border border-amber-200/60">
              <Megaphone size={26} />
            </div>
            <h3 className="text-sm font-black text-zinc-900">
              لا توجد حملات إعلانية مطابقة
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              لم يتم العثور على أي حملات بناءً على معايير البحث والفلترة. اضغط على زر &quot;إنشاء حملة جديدة&quot; للبدء!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              إنشاء أول حملة الآن
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200/80">
                <tr>
                  <th className="py-3.5 px-4">اسم الحملة والمنصة</th>
                  <th className="py-3.5 px-4">الوجهة المستهدفة</th>
                  <th className="py-3.5 px-4">الرابط القصير الموثوق</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">الزيارات الفعلية</th>
                  <th className="py-3.5 px-4">الشيك أوت</th>
                  <th className="py-3.5 px-4">المبيعات</th>
                  <th className="py-3.5 px-4">نسبة التحويل</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {filteredCampaigns.map((camp) => {
                  const metrics = campaignMetricsMap[camp.id] || {
                    totalVisits: 0,
                    uniqueVisitors: new Set(),
                    reachedCart: 0,
                    reachedCheckout: 0,
                    convertedOrders: 0,
                  };
                  const uniqueCount = metrics.uniqueVisitors.size || metrics.totalVisits || 1;
                  const convRate = Math.round((metrics.convertedOrders / uniqueCount) * 100);
                  const shortUrl = `${origin}/c/${camp.slug}`;
                  const isCopied = copiedSlug === camp.slug;

                  return (
                    <tr
                      key={camp.id}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Campaign Name & Platform */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/admin/campaigns/${camp.id}`}
                            className="font-bold text-zinc-900 text-sm hover:text-amber-600 transition-colors flex items-center gap-1.5"
                          >
                            <span>{camp.name}</span>
                            <ArrowRight size={13} className="text-zinc-400 rotate-180" />
                          </Link>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                              {camp.platform}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {camp.medium}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Destination Target */}
                      <td className="py-4 px-4">
                        {camp.targetType === "product" ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden relative shrink-0 border border-zinc-200">
                              <Image
                                src={camp.targetProductImage || "/placeholder.jpg"}
                                alt={camp.targetProductName || "منتج"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col max-w-[160px]">
                              <span className="font-bold text-zinc-900 truncate text-[11px]">
                                {camp.targetProductName || "منتج المتجر"}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                منتج مخصص
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-zinc-700 font-bold text-xs">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                              <Globe size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span>المتجر ككل</span>
                              <span className="text-[10px] text-zinc-400 font-normal">
                                الصفحة الرئيسية
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Short Link */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200 select-all dir-ltr">
                            /c/{camp.slug}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyShortLink(camp.slug)}
                            title="نسخ الرابط القصير"
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <Check size={14} className="text-emerald-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="تجربة الرابط"
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(camp)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            camp.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              camp.status === "active"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span>{camp.status === "active" ? "نشطة" : "متوقفة"}</span>
                        </button>
                      </td>

                      {/* Visits */}
                      <td className="py-4 px-4 font-black text-zinc-900 text-sm">
                        {metrics.totalVisits}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">زيارة</span>
                      </td>

                      {/* Checkout */}
                      <td className="py-4 px-4 font-bold text-purple-600">
                        {metrics.reachedCheckout}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">شخص</span>
                      </td>

                      {/* Converted Orders */}
                      <td className="py-4 px-4 font-black text-emerald-600">
                        {metrics.convertedOrders}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">طلب</span>
                      </td>

                      {/* Conv. Rate */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                            convRate > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "text-zinc-400"
                          }`}
                        >
                          {convRate}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/campaigns/${camp.id}`}
                            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                            title="عرض الإحصائيات الكاملة"
                          >
                            <BarChart3 size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(camp)}
                            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                            title="تعديل الإعدادات"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(camp)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors cursor-pointer"
                            title="حذف الحملة"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT CAMPAIGN MODAL (Clean White Mode) ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 overflow-hidden my-8 text-zinc-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-900">
                      {editingCampaign ? "تعديل إعدادات الحملة" : "إنشاء حملة إعلانية جديدة"}
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      حدد الوجهة والكود القصير لإنشاء رابط موثوق وسهل
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCampaign} className="mt-5 space-y-4 text-xs">
                {/* 1. Campaign Name */}
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    1. اسم الحملة الإعلانية: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="مثال: عروض تيشيرت الصيف - تيك توك"
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs font-semibold placeholder:text-zinc-400"
                  />
                </div>

                {/* 2. Target Type */}
                <div>
                  <label className="font-bold text-zinc-800 block mb-1.5">
                    2. وجهة الإعلان (أين يذهب العميل عند النقر؟):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormTargetType("product")}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-right cursor-pointer ${
                        formTargetType === "product"
                          ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      <Package size={18} className="text-amber-500 shrink-0" />
                      <div>
                        <span className="block text-xs font-bold">منتج محدد</span>
                        <span className="block text-[10px] text-zinc-500">يفتح صفحة المنتج مباشرة</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTargetType("website")}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-right cursor-pointer ${
                        formTargetType === "website"
                          ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                          : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      <Globe size={18} className="text-blue-500 shrink-0" />
                      <div>
                        <span className="block text-xs font-bold">المتجر ككل</span>
                        <span className="block text-[10px] text-zinc-500">يفتح الصفحة الرئيسية</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Product Select (if product target) */}
                {formTargetType === "product" && (
                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      اختر المنتج المستهدف:
                    </label>
                    <select
                      value={formProductId}
                      onChange={(e) => setFormProductId(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {formatPrice(p.salePrice ?? p.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Short Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-zinc-800">
                      3. الكود القصير للرابط (Short Slug): <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400">حروف إنجليزية وأرقام فقط</span>
                  </div>
                  <div className="flex items-center gap-1.5 dir-ltr bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                    <span className="text-zinc-500 font-mono text-xs font-bold shrink-0">
                      {origin.replace(/^https?:\/\//, "")}/c/
                    </span>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) =>
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, "-")
                        )
                      }
                      placeholder="summer-deal"
                      className="flex-1 bg-transparent text-zinc-900 font-mono font-bold text-xs focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-600 mt-1 font-semibold">
                    💡 رابط قصير وأنيق لا يخيف الزبون ويضمن تحويلات أعلى بنسبة 40%
                  </p>
                </div>

                {/* 4. Platform & Medium */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      المنصة الإعلانية:
                    </label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      نوع الإعلان:
                    </label>
                    <select
                      value={formMedium}
                      onChange={(e) => setFormMedium(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-semibold focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {MEDIUMS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Budget & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      ميزانية الإعلان (ج.م - اختياري):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      placeholder="مثال: 500"
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-800 block mb-1">
                      حالة الحملة:
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs font-bold focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="active">نشطة (تستقبل زيارات)</option>
                      <option value="paused">متوقفة مؤقتاً</option>
                    </select>
                  </div>
                </div>

                {/* 6. Notes */}
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    ملاحظات أو تفاصيل الاستهداف (اختياري):
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="ملاحظات عن الجمهور المستهدف، تاريخ بدء الإعلان..."
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs focus:bg-white focus:outline-none placeholder:text-zinc-400"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <Spinner size="sm" />}
                    <span>{editingCampaign ? "حفظ التعديلات" : "إنشاء الحملة وتوليد الرابط"}</span>
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
