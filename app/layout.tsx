import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/features/cart/CartProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { WishlistProvider } from "@/features/wishlist/WishlistProvider";
import { SiteSettingsProvider } from "@/features/settings/SiteSettingsProvider";
import { ErrorTrackerProvider } from "@/components/ui/ErrorTrackerProvider";
import { LanguageProvider } from "@/features/language/LanguageProvider";
import { Toaster } from "sonner";


const gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Y9G4D0TC9L";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://totysport.com"
  ),
  title: {
    default: "Toty Sport | البراند المفضل للتيشرتات والملابس الرياضية",
    template: "%s | Toty Sport",
  },
  description:
    "تسوق أحدث تشكيلات التيشرتات والملابس الرياضية الأصلية لأعظم أندية ومنتخبات العالم من براند Toty Sport. خامات ممتازة وشحن لجميع محافظات مصر.",
  keywords: [
    "totysport",
    "Toty Sport",
    "Toty Sportswear",
    "Toty Sport Egypt",
    "براند توتي سبورت",
    "توتي سبورت",
    "تيشرتات رياضية",
    "تيشرتات أندية 24/25",
    "تيشرتات كورة مصر",
    "ملابس رياضية",
    "Football Jerseys Egypt",
    "Real Madrid jersey",
    "Barcelona jersey",
  ],
  authors: [{ name: "Toty Sport Brand" }],
  creator: "Toty Sport",
  publisher: "Toty Sport",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://totysport.com",
    siteName: "Toty Sport - براند توتي سبورت",
    title: "Toty Sport | More Than Just a Jersey",
    description:
      "تسوق أحدث تشكيلات التيشرتات الرياضية الحصرية من براند Toty Sport.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Toty Sport Brand Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toty Sport | More Than Just a Jersey",
    description: "تسوق أحدث تشكيلات التيشرتات الرياضية من براند Toty Sport.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`dark ${outfit.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('toty-theme', 'dark');
                  localStorage.removeItem('luno-theme');
                  localStorage.removeItem('nxt-theme');
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="json-ld-brand"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "name": "Toty Sport",
              "alternateName": ["توتي سبورت", "Toty Sport", "toty_sport22", "Toty"],
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://totysport.com",
              "logo": "/logo.png",
              "image": "/logo.png",
              "description": "براند Toty Sport المتخصص في التيشرتات والملابس الرياضية الأصلية في مصر."
            })
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <ErrorTrackerProvider>
          <LanguageProvider>
            <SiteSettingsProvider>
              <AuthProvider>
                <ThemeProvider>
                  <CartProvider>
                    <WishlistProvider>
                      {children}
                      <Toaster
                        position="top-center"
                        toastOptions={{
                          style: {
                            background: "#000",
                            color: "#fff",
                            borderRadius: "12px",
                            border: "none",
                          },
                        }}
                      />
                    </WishlistProvider>
                  </CartProvider>
                </ThemeProvider>
              </AuthProvider>
            </SiteSettingsProvider>
          </LanguageProvider>
        </ErrorTrackerProvider>

      </body>
    </html>
  );
}
