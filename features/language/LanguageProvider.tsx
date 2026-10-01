"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "ar" | "en";

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations = {
  // Navigation
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.shop": { ar: "المتجر", en: "Shop" },
  "nav.reviews": { ar: "آراء العملاء", en: "Reviews" },
  "nav.about": { ar: "من نحن", en: "About Us" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },

  // Header & Actions
  "header.search": { ar: "بحث عن تيشرت...", en: "Search jerseys..." },
  "header.cart": { ar: "سلة الشراء", en: "Shopping Cart" },
  "header.wishlist": { ar: "المفضلة", en: "Wishlist" },
  "header.themeLight": { ar: "الوضع النهاري", en: "Light Mode" },
  "header.themeDark": { ar: "الوضع الليلي", en: "Dark Mode" },
  "header.switchLang": { ar: "English", en: "العربية" },
  "header.currentLang": { ar: "عربي", en: "EN" },
  "header.langLabel": { ar: "EN", en: "عربي" },

  // Hero Section
  "hero.badge": { ar: "الإصدار الاحترافي 2026 • تشكيلة الأساطير", en: "PRO EDITION 2026 • LEGENDS COLLECTION" },
  "hero.title": { ar: "أكثر من مجرد تيشرت.. شغف يعاش", en: "MORE THAN JUST A JERSEY.. IT'S A PASSION" },
  "hero.subtitle": { ar: "اكتشف أحدث وأقوى تيشرتات أندية ومنتخبات العالم بأعلى جودة مطابقة للأصل وخامات رياضية تتنفس.", en: "Discover the latest authentic club and national team jerseys with match-grade breathable fabrics." },
  "hero.shopNow": { ar: "تسوق التيشرتات", en: "SHOP JERSEYS" },
  "hero.scroll": { ar: "للتمرير", en: "SCROLL" },

  // Products Section
  "products.subtitle": { ar: "مختارة خصيصاً لك", en: "CURATED FOR YOU" },
  "products.title": { ar: "أحدث التيشرتات الرياضية", en: "LATEST FOOTBALL KITS" },
  "products.all": { ar: "كل المنتجات", en: "All Products" },
  "products.bestSeller": { ar: "الأكثر طلباً", en: "BEST SELLER" },
  "products.new": { ar: "جديدنا", en: "NEW ARRIVAL" },
  "products.playerVersion": { ar: "نسخة لاعبين", en: "PLAYER VERSION" },
  "products.addToCart": { ar: "أضف للسلة", en: "Add to Cart" },
  "products.added": { ar: "تمت الإضافة!", en: "Added!" },
  "products.quickView": { ar: "معاينة سريعة", en: "Quick View" },
  "products.selectSize": { ar: "اختر المقاس", en: "Select Size" },
  "products.outOfStock": { ar: "نفد من المخزون", en: "Out of Stock" },
  "products.onlyLeft": { ar: "متبقي {count} قطع فقط", en: "Only {count} left in stock" },
  "products.currency": { ar: "ج.م", en: "EGP" },
  "products.egp": { ar: "جنيه مصري", en: "EGP" },
  "products.inStock": { ar: "متوفر بالمخزون", en: "In Stock" },
  "products.itemsAvailable": { ar: "قطع متوفرة في المخزن", en: "items available in stock" },
  "products.color": { ar: "اللون", en: "Color" },
  "products.size": { ar: "المقاس", en: "Size" },
  "products.sizeGuide": { ar: "جدول المقاسات", en: "Size Guide" },
  "products.sizeGuideTitle": { ar: "جدول مقاسات", en: "Size Guide for" },
  "products.sizeGuideNote": { ar: "جميع المقاسات دقيقة ومصممة بعناية لمنتجات Toty Sport", en: "All measurements are accurate and tailored for Toty Sport garments" },
  "products.details": { ar: "تفاصيل التيشرت", en: "Jersey Details" },
  "products.viewProduct": { ar: "عرض التفاصيل", en: "View Details" },
  "products.backToShop": { ar: "العودة للمتجر", en: "Back to Shop" },
  "products.loading": { ar: "جاري تحميل تفاصيل المنتج...", en: "Loading product details..." },
  "products.notFound": { ar: "المنتج غير متوفر حالياً", en: "Product currently unavailable" },
  "products.notFoundSub": { ar: "عفواً، لم نتمكن من العثور على بيانات هذا المنتج.", en: "Sorry, we could not find data for this product." },
  "products.defaultDesc": { ar: "خامة قطنية رياضية فاخرة بتصميم مريح وعالي التهوية", en: "Premium athletic breathable fabric with match-grade tailored fit" },
  "products.clickForNext": { ar: "اضغط للتالي", en: "Click for next" },

  // Cart Drawer
  "cart.title": { ar: "سلة الشراء", en: "Shopping Cart" },
  "cart.empty": { ar: "سلة الشراء فارغة", en: "Your cart is empty" },
  "cart.emptySub": { ar: "أضف منتجاتك المفضلة لبدء التسوق الآن", en: "Add your favorite jerseys to start shopping now" },
  "cart.startShopping": { ar: "تصفح المنتجات", en: "Browse Products" },
  "cart.subtotal": { ar: "المجموع", en: "Subtotal" },
  "cart.discountApplied": { ar: "تم تطبيق خصم العرض! 🎉", en: "Bundle Discount Applied! 🎉" },
  "cart.savedAmount": { ar: "وفّرت تلقائياً على طلبك", en: "You saved automatically" },
  "cart.bundleOffer": { ar: "خصم العرض", en: "Bundle Discount" },
  "cart.afterDiscount": { ar: "بعد الخصم", en: "After Discount" },
  "cart.shipping": { ar: "الشحن", en: "Shipping" },
  "cart.freeShipping": { ar: "يتم حسابه عند الدفع", en: "Calculated at checkout" },
  "cart.checkout": { ar: "إتمام الشراء الآن", en: "Proceed to Checkout" },
  "cart.clear": { ar: "إفراغ السلة", en: "Clear Cart" },

  // Wishlist Drawer
  "wishlist.title": { ar: "المفضلة", en: "Wishlist" },
  "wishlist.empty": { ar: "قائمة المفضلة فارغة", en: "Your wishlist is empty" },
  "wishlist.emptySub": { ar: "احفظ المنتجات التي تحبها هنا لتسوقها لاحقاً!", en: "Save items you love here to shop them later!" },
  "wishlist.browse": { ar: "تصفح المنتجات", en: "Browse Products" },
  "wishlist.viewItem": { ar: "عرض المنتج", en: "View Product" },
  "wishlist.remove": { ar: "إزالة من المفضلة", en: "Remove from wishlist" },
  "wishlist.add": { ar: "إضافة للمفضلة", en: "Add to wishlist" },

  // Checkout Page
  "checkout.title": { ar: "إتمام الطلب والشحن", en: "Checkout & Shipping" },
  "checkout.stepShipping": { ar: "بيانات التوصيل", en: "Delivery Details" },
  "checkout.stepPayment": { ar: "طريقة الدفع", en: "Payment Method" },
  "checkout.fullName": { ar: "الاسم بالكامل", en: "Full Name" },
  "checkout.fullNamePlaceholder": { ar: "أدخل اسمك ثلاثي", en: "Enter your full name" },
  "checkout.phone": { ar: "رقم الهاتف (واتساب)", en: "Phone Number (WhatsApp)" },
  "checkout.phonePlaceholder": { ar: "01xxxxxxxxx", en: "01xxxxxxxxx" },
  "checkout.governorate": { ar: "المحافظة", en: "Governorate" },
  "checkout.selectGov": { ar: "اختر المحافظة...", en: "Select governorate..." },
  "checkout.city": { ar: "المدينة / المركز", en: "City / District" },
  "checkout.cityPlaceholder": { ar: "مثال: المعادي، مدينة نصر، المهندسين", en: "e.g. Maadi, Nasr City, Dokki" },
  "checkout.address": { ar: "العنوان بالتفصيل", en: "Detailed Address" },
  "checkout.addressPlaceholder": { ar: "اسم الشارع، رقم العمارة، رقم الشقة، علامة مميزة", en: "Street name, building no., apt no., landmark" },
  "checkout.paymentMethod": { ar: "اختر طريقة الدفع", en: "Select Payment Method" },
  "checkout.cod": { ar: "الدفع عند الاستلام (COD)", en: "Cash on Delivery (COD)" },
  "checkout.codDesc": { ar: "ادفع نقداً عند استلام ومعاينة التيشرت", en: "Pay in cash upon inspection & delivery" },
  "checkout.vodafoneCash": { ar: "فودافون كاش", en: "Vodafone Cash" },
  "checkout.instapay": { ar: "انستاباي (InstaPay)", en: "InstaPay" },
  "checkout.orderSummary": { ar: "ملخص الطلب", en: "Order Summary" },
  "checkout.placeOrder": { ar: "تأكيد الطلب الآن", en: "Confirm Order Now" },
  "checkout.processing": { ar: "جاري تأكيد طلبك...", en: "Processing your order..." },

  // Footer
  "footer.brandTagline": {
    ar: "البراند الرائد للتيشرتات الرياضية الفاخرة وأطقم الأندية والمنتخبات العالمية بأعلى خامات وأدق تفاصيل في مصر.",
    en: "Egypt's leading brand for authentic match-grade club and national team football jerseys.",
  },
  "footer.location": { ar: "القاهرة، مصر", en: "Cairo, Egypt" },
  "footer.locationLabel": { ar: "المقر الرئيسي", en: "Headquarters" },
  "footer.phone": { ar: "01272168789 20+", en: "+20 12 72168789" },
  "footer.whatsapp": { ar: "واتساب مباشر", en: "Direct WhatsApp" },
  "footer.chatWhatsapp": { ar: "تحدث معنا عبر واتساب", en: "Chat on WhatsApp" },
  "footer.onlineSupport": { ar: "خدمة عملاء متاحة 24/7", en: "24/7 Customer Support" },
  "footer.quickLinks": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.home": { ar: "الرئيسية", en: "Home" },
  "footer.shop": { ar: "تشكيلة التيشرتات", en: "Jerseys Collection" },
  "footer.reviews": { ar: "آراء عملائنا", en: "Customer Reviews" },
  "footer.about": { ar: "عن توتي سبورت", en: "About Toty Sport" },
  "footer.contact": { ar: "تواصل معنا", en: "Contact Us" },
  "footer.policies": { ar: "السياسات والشروط", en: "Policies & Terms" },
  "footer.shippingPolicy": { ar: "الشحن والتوصيل", en: "Shipping & Delivery" },
  "footer.privacyPolicy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  "footer.terms": { ar: "الشروط والأحكام", en: "Terms of Service" },
  "footer.followUs": { ar: "تابعنا على السوشيال ميديا", en: "Follow Us" },
  "footer.guarantee1Title": { ar: "خامات أصلية 100%", en: "100% Match Grade" },
  "footer.guarantee1Desc": { ar: "أقمشة رياضية تتنفس مطابقة لأطقم الملاعب", en: "Breathable player fabrics identical to the pitch" },
  "footer.guarantee2Title": { ar: "معاينة قبل الدفع", en: "Inspect on Delivery" },
  "footer.guarantee2Desc": { ar: "افتح وعاين جودة التيشرت بنفسك مع المندوب", en: "Check your jersey quality in front of courier" },
  "footer.authenticKits": { ar: "أطقم ونسخ اللاعبين الأصلية", en: "AUTHENTIC MATCH KITS" },
  "footer.securePayments": { ar: "دفع آمن ومضمون", en: "Secure Payments" },
  "footer.trustedBrand": { ar: "علامة تجارية موثوقة", en: "Trusted Brand" },
  "footer.fastDelivery": { ar: "توصيل سريع ومؤمن", en: "Fast Delivery" },
  "footer.allRightsReserved": { ar: "© 2026 توتي سبورت. جميع الحقوق محفوظة.", en: "© 2026 Toty Sport. All rights reserved." },
  "footer.guarantee3Title": { ar: "توصيل سريع للقاهرة ومصر", en: "Fast Delivery in Egypt" },
  "footer.guarantee3Desc": { ar: "شحن سريع وآمن حتى باب بيتك", en: "Fast and insured delivery directly to your doorstep" },
  "footer.copyright": { ar: "جميع الحقوق محفوظة © 2026 براند Toty Sport", en: "All Rights Reserved © 2026 Toty Sport Brand" },
  "footer.developedBy": { ar: "تم التطوير بواسطة", en: "Developed by" },
  "footer.vipBadge": { ar: "نادي عشاق الساحرة المستديرة", en: "THE FOOTBALL CULTURE CLUB" },
  "footer.vipTitle": { ar: "أقوى تيشرتات الأندية والمنتخبات بجودة الملاعب", en: "MATCH-GRADE KITS FOR TRUE PASSION" },
  "footer.vipDesc": { ar: "اطلب أي تيشرت تريده فوراً عبر الواتساب أو تصفح تشكيلتنا الحصرية مع إمكانية المعاينة قبل الدفع.", en: "Order your favorite jersey instantly via WhatsApp or explore our kits with inspect-on-delivery guarantee." },
  "footer.orderWhatsapp": { ar: "اطلب الآن عبر واتساب", en: "Order on WhatsApp" },
  "footer.tiktokSub": { ar: "فيديوهات ومعاينات الأطقم", en: "Jersey Reviews & Drops" },
  "footer.instaSub": { ar: "أحدث الصور والتشكيلات", en: "New Drops & Lifestyle" },
  "footer.paymentsTitle": { ar: "طرق الدفع المتاحة", en: "Accepted Payments" },
  "footer.codBadge": { ar: "دفع عند الاستلام (COD)", en: "Cash on Delivery" },
  "footer.instapayBadge": { ar: "انستاباي (InstaPay)", en: "InstaPay" },
  "footer.vodafoneBadge": { ar: "فودافون كاش", en: "Vodafone Cash" },

  // Shop Page
  "shop.title": { ar: "تشكيلة تيشرتات Toty Sport", en: "Toty Sport Football Collection" },
  "shop.subtitle": { ar: "تصفح أحدث أطقم الأندية والمنتخبات العالمية بأعلى خامات رياضية مطابقة للملعب.", en: "Browse the latest club and national kits crafted with match-grade breathable performance fabrics." },
  "shop.searchPlaceholder": { ar: "ابحث عن تيشرت، نادي، أو منتخب...", en: "Search jerseys, clubs, or teams..." },
  "shop.all": { ar: "الكل", en: "All" },
  "shop.noProducts": { ar: "لا توجد منتجات مطابقة", en: "No matching jerseys found" },
  "shop.noProductsSub": { ar: "جرب البحث بكلمة أخرى أو تغيير الفئة.", en: "Try searching with different terms or selecting another category." },

  // Reviews Page
  "reviews.breadcrumbHome": { ar: "الرئيسية", en: "Home" },
  "reviews.breadcrumbTitle": { ar: "آراء وتجارب العملاء", en: "Customer Reviews & Feedbacks" },
  "reviews.badge": { ar: "تجارب حقيقية • REAL EXPERIENCES", en: "CUSTOMER REVIEWS • VERIFIED EXPERIENCES" },
  "reviews.title": { ar: "ماذا يقول عملاء Toty Sport؟", en: "What Customers Say About Toty Sport" },
  "reviews.subtitle": { ar: "آراء وتجارب موثقة من عملائنا في جميع محافظات مصر — شاركنا رأيك وانطباعك بكل شفافية!", en: "Verified customer experiences across Egypt. Share your feedback with us!" },
  "reviews.addReview": { ar: "أضف رأيك وتجربتك", en: "Add Your Review" },
  "reviews.loading": { ar: "جاري تحميل تقييمات العملاء...", en: "Loading customer reviews..." },
  "reviews.emptyTitle": { ar: "كن أول من يشارك تجربته مع Toty Sport", en: "Be the first to share your experience with Toty Sport" },
  "reviews.emptySub": { ar: "رأيك يبني الثقة ويساعد مجتمعنا على اختيار التيشرتات المناسبة! شاركنا انطباعك عن الجودة والمقاسات وسرعة التوصيل.", en: "Your feedback builds trust and helps our community choose the right jerseys! Share your experience on quality, sizing, and delivery." },
  "reviews.badge1": { ar: "تقييم موثوق 100%", en: "100% Verified Review" },
  "reviews.badge2": { ar: "خصوصية تامة للبيانات", en: "100% Privacy Protected" },
  "reviews.badge3": { ar: "نشر فوري معتمد", en: "Instant Verified Post" },
  "reviews.addFirst": { ar: "✍️ أضف أول تقييم لك الآن", en: "✍️ Write the first review now" },
  "reviews.verified": { ar: "موثوق ✓", en: "Verified ✓" },
  "reviews.verifiedClient": { ar: "عميل معتمد", en: "Verified Customer" },
  "reviews.helpful": { ar: "هل كان هذا الرأي مفيداً؟", en: "Was this review helpful?" },
  "reviews.likes": { ar: "إعجاب", en: "Likes" },
  "reviews.modalTitle": { ar: "شاركنا رأيك وتجربتك في Toty Sport", en: "Share your experience with Toty Sport" },
  "reviews.modalSub": { ar: "رأيك يسعدنا جداً ويفيد جميع محبي كرة القدم الجدد في مصر ❤️", en: "Your review delights us and helps football fans across Egypt ❤️" },
  "reviews.nameLabel": { ar: "اسمك الكريم *", en: "Your Full Name *" },
  "reviews.namePlaceholder": { ar: "أدخل اسمك أو لقبك", en: "Enter your name" },
  "reviews.phoneLabel": { ar: "رقم الهاتف للتأكيد *", en: "Phone Number for confirmation *" },
  "reviews.phoneSecret": { ar: "سري للإدارة فقط", en: "Confidential for admins only" },
  "reviews.avatarLabel": { ar: "تحديد الشخصية / الأيقونة *", en: "Select Character Avatar *" },
  "reviews.male": { ar: "شاب (ذكر)", en: "Male" },
  "reviews.female": { ar: "بنت (أنثى)", en: "Female" },
  "reviews.ratingLabel": { ar: "تقييمك للمنتجات والخدمة *", en: "Your Rating for Products & Service *" },
  "reviews.messageLabel": { ar: "رأيك وتجربتك بالتفصيل *", en: "Your Detailed Feedback *" },
  "reviews.messagePlaceholder": { ar: "تحدث عن جودة قماش التيشرت، دقة التطريز والطباعة، والمقاسات، وسرعة الشحن...", en: "Share your thoughts on jersey fabric, stitching, badges, fit, and delivery speed..." },
  "reviews.submitBtn": { ar: "إرسال التقييم الآن", en: "Submit Review Now" },
  "reviews.submitting": { ar: "جاري الإرسال...", en: "Submitting..." },

  // Order Success Page
  "orderSuccess.title": { ar: "تم تأكيد طلبك بنجاح! 🎉", en: "Order Placed Successfully! 🎉" },
  "orderSuccess.subtitle": { ar: "شكراً لتسوقك من Toty Sport. بدأنا تجهيز وفحص طلبك فوراً.", en: "Thank you for shopping with Toty Sport. We will prepare and dispatch your order immediately." },
  "orderSuccess.orderId": { ar: "رقم الطلب", en: "Order ID" },
  "orderSuccess.whatsNext": { ar: "الخطوات التالية", en: "What's next?" },
  "orderSuccess.step1": { ar: "• نتواصل معك لتأكيد المقاسات والعنوان قبل خروج المندوب", en: "• We contact you to confirm sizing & address before dispatch" },
  "orderSuccess.step2": { ar: "• احتفظ برقم الطلب لمتابعة الشحنة أو التواصل مع خدمة العملاء", en: "• Keep your Order ID handy for any tracking inquiries" },
  "orderSuccess.step3": { ar: "• يحق لك معاينة التيشرت والتأكد من جودته وخامته قبل استلامه", en: "• You can inspect the jersey quality and fit upon delivery" },
  "orderSuccess.step4": { ar: "• الدفع نقداً عند الاستلام أو عبر انستاباي وفودافون كاش", en: "• Pay Cash on Delivery, InstaPay, or Vodafone Cash" },
  "orderSuccess.continue": { ar: "متابعة التسوق", en: "Continue Shopping" },
  "orderSuccess.goHome": { ar: "الصفحة الرئيسية", en: "Go Home" },
};

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  dir: "rtl" | "ltr";
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  isRTL: true,
  dir: "rtl",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    // Read saved language from localStorage
    try {
      const saved = localStorage.getItem("toty-lang") as Language | null;
      if (saved === "ar" || saved === "en") {
        setLanguageState(saved);
        applyLanguage(saved);
      } else {
        applyLanguage("ar");
      }
    } catch {
      applyLanguage("ar");
    }
  }, []);

  const applyLanguage = (lang: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyLanguage(lang);
    try {
      localStorage.setItem("toty-lang", lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = language === "ar" ? "en" : "ar";
    setLanguage(nextLang);
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const entry = (translations as Record<string, { ar: string; en: string }>)[key];
    if (entry) {
      return entry[language] || entry["ar"] || fallback || key;
    }
    return fallback || key;
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, isRTL, dir, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

