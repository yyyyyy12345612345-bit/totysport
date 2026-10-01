# Toty Sport — Official Sportswear & Football Jerseys Platform

> **Toty Sport (توتي سبورت)** — منصة التجارة الإلكترونية الرسمية لبراند توتي سبورت المتخصص في أرقى تشكيلات التيشرتات والملابس الرياضية الأصلية وأطقم الأندية والمنتخبات العالمية بأحدث معايير الويب الفاخر.

---

## 🔗 الروابط الرسمية (Official Links & Socials)

| المنصة | الحساب / الرابط | الوصف |
|--------|-----------------|-------|
| 🌐 **الموقع الرسمي** | [totysport.com](https://totysport.com) | الموقع الرسمي لمتجر Toty Sport |
| 🎵 **TikTok** | [@toty_sport22](https://www.tiktok.com/@toty_sport22?_r=1&_t=ZS-9AAj8sgxdvM) | الحساب الرسمي على تيك توك |
| 📸 **Instagram** | [@toty_sport22](https://www.instagram.com/toty_sport22/) | الحساب الرسمي على إنستجرام |
| 💬 **WhatsApp / Phone** | `01107108679` (`+201107108679`) | خدمة العملاء وتأكيد الطلبات |
| 💳 **InstaPay** | `@toty_sport22` | الدفع الفوري عبر إنستاباي |
| ✉️ **الدعم الفني** | `totysport.official@gmail.com` | البريد الإلكتروني الرسمي |
| 🛠️ **الدعم البرمجي والتطوير** | `01020451206` ([WhatsApp](https://wa.me/201020451206)) | رقم المطور للتعديلات البرمجية والدعم الفني |
| 🐙 **GitHub Repo** | [github.com/yyyyyy12345612345-bit/totysport](https://github.com/yyyyyy12345612345-bit/totysport) | المستودع البرمجي الرسمي للمشروع |

---

## 🚀 Quick Start (التشغيل السريع)

### 1. تثبيت الحزم والمكتبات
```bash
npm install
```

### 2. إعداد المتغيرات البيئية
```bash
cp .env.local.example .env.local
# قم بإضافة مفاتيح Firebase و Cloudinary الجديدة الخاصة بـ Toty Sport
```

### 3. تشغيل سيرفر التطوير المحلي
```bash
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

---

## 🔧 إعداد الخدمات السحابية (Cloud Integrations)

### إعداد Firebase
1. ادخل على [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروعاً جديداً باسم `toty-sport`
3. فعّل **Authentication** (البريد الإلكتروني / كلمة المرور للمشرفين)
4. فعّل قاعدة بيانات **Cloud Firestore**
5. انسخ بيانات الاعتماد إلى ملف `.env.local`

### صلاحيات الأدمن (Firebase Admin)
1. من لوحة Firebase ← إعدادات المشروع (Project Settings) ← حسابات الخدمة (Service Accounts)
2. أنشئ مفتاح خاص جديد (Generate new private key) وحمل ملف JSON
3. ضع القيم (`project_id`, `client_email`, `private_key`) في `.env.local`

### إعداد Cloudinary (لرفع صور التيشرتات)
1. أنشئ حساباً على [Cloudinary](https://cloudinary.com)
2. من الإعدادات ← Upload ← أضف Upload Preset جديد
3. اجعل اسمه `toty_products` ونوعه **Unsigned**
4. ضع اسم الـ Cloud Name في `.env.local`

---

## 📁 هيكلة المشروع (Project Structure)

```
totysport/
├── app/
│   ├── (store)/                 # واجهة المتجر العامة
│   │   ├── page.tsx             # الصفحة الرئيسية (Hero, Products, Categories)
│   │   ├── shop/                # تصفح كافة التيشرتات الرياضية
│   │   ├── products/[slug]/     # صفحة تفاصيل المنتج وجدول المقاسات
│   │   ├── cart/                # سلة التسوق
│   │   ├── checkout/            # إتمام الطلب والدفع (فودافون كاش / إنستاباي / استلام)
│   │   ├── order-success/       # شاشة نجاح الطلب ورسالة الواتساب
│   │   ├── contact/             # التواصل وحسابات السوشيال الرسمية
│   │   ├── privacy/             # سياسة الخصوصية
│   │   └── terms/               # الشروط والأحكام
│   ├── (admin)/                 # لوحة التحكم الإدارية
│   │   └── admin/
│   │       ├── login/           # تسجيل دخول المشرف
│   │       ├── page.tsx         # لوحة الإحصائيات الشاملة والـ KPIs
│   │       ├── orders/          # إدارة وتتبع الطلبات والتوصيل والواتساب
│   │       ├── products/        # إضافة وتعديل التيشرتات والمخزون والمقاسات
│   │       ├── categories/      # إدارة أقسام الأندية والمنتخبات
│   │       ├── shipping/        # إدارة أسعار الشحن للمحافظات
│   │       ├── campaigns/       # رادار الحملات الإعلانية ومصادر الزيارات
│   │       └── settings/        # إعدادات المتجر وأرقام الدفع واللوجو
│   ├── robots.ts
│   ├── sitemap.ts
│   └── globals.css
├── components/
│   ├── intros/                  # TotyMatchIntro (الانترو السينمائية لدخول الاستاد والمباراة)
│   ├── layout/                  # الهيدر، الفوتر، القوائم المتجاوبة، أيقونة السلة
│   ├── home/                    # HeroSection, FeaturedJerseys, Categories
│   ├── products/                # ProductCard, ProductGrid, SizePicker
│   ├── cart/                    # CartSidebar
│   └── ui/                      # أزرار كروية مخصصة، إشعارات Sonner
├── features/
│   ├── auth/                    # AuthProvider لإدارة جلسات الأدمن
│   ├── cart/                    # CartProvider مع المزامنة المحلية
│   └── settings/                # مزود إعدادات المتجر الفورية
├── lib/
│   └── firebase/                # إعدادات وقواعد Firestore والحماية
└── public/                      # لوجو Toty Sport وصور التيشرتات
```

---

## 🎨 الهوية البصرية (Brand Identity & Theme)

* **الألوان الأساسية**:
  * **Deep Black (`#000000`)**: الخلفية العميقة المتماشية مع هوية الملاعب والدارك مود الفاخر.
  * **Volt Neon Lime (`#CCFF00`)**: لون الإضاءة الرياضي الحيوي المميز لأزرار وتفاصيل Brand Toty Sport.
  * **Pure White (`#FFFFFF`)**: وضوح تام للنصوص والتفاصيل.
* **الخطوط (Typography)**:
  * **Outfit**: للعناوين الإنجليزية الرياضية والواجهات العصرية.
  * **Inter**: للنصوص والقراءات التفاعلية المريحة للعين.

---

## 🚀 الرفع على GitHub ومواقع الاستضافة

### 1. الرفع على GitHub
```bash
git init
git add .
git commit -m "feat: initial Toty Sport official jerseys platform"
git branch -M main
git remote add origin https://github.com/yyyyyy12345612345-bit/totysport.git
git push -u origin main --force
```

أو استخدام السكريبت الجاهز المرفق بالمشروع:
* على ويندوز: اضغط مرتين على `push_to_github.bat`
* على لينكس/ماك: قم بتشغيل `./push_to_github.sh`

### 2. النشر على Vercel
1. افتح منصة [Vercel](https://vercel.com)
2. قم بربط مستودع GitHub `totysport/totysport`
3. أضف متغيرات البيئة من `.env.local`
4. اضغط **Deploy**

---

## 📞 الدعم والتواصل الرسمي

* **WhatsApp / Phone**: `01107108679`
* **Instagram**: [@toty_sport22](https://www.instagram.com/toty_sport22/)
* **TikTok**: [@toty_sport22](https://www.tiktok.com/@toty_sport22?_r=1&_t=ZS-9AAj8sgxdvM)
* **Email**: `totysport.official@gmail.com`

---
© 2026 **Toty Sport (توتي سبورت)** — جميع الحقوق محفوظة.
