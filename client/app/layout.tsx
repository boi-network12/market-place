import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import LoadingBar from "@/components/ui/LoadingBar";
import PageLoader from "@/components/ui/PageLoader";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Domain configuration
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "market.kamdi-dev.click";
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL || "https";
const BASE_URL = `${PROTOCOL}://${DOMAIN}`;

// Proxy configuration for API routes
export const proxyConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_PROXY === "true",
  apiProxy: process.env.NEXT_PUBLIC_API_PROXY || "/api/proxy",
  baseUrl: BASE_URL,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kamdi Market | Enterprise Tech & Cybersecurity Marketplace",
    template: "%s | Kamdi Market"
  },
  description: "Government-approved marketplace for enterprise tech solutions, cybersecurity tools, ethical hacking software, and certified unlocked devices. Trusted by security professionals worldwide.",
  keywords: [
    "cybersecurity marketplace",
    "ethical hacking tools",
    "penetration testing software",
    "enterprise tech",
    "unlocked smartphones",
    "government approved",
    "security tools",
    "Kamdi Market",
    "tech marketplace",
    "certified devices"
  ].join(", "),
  authors: [{ name: "Kamdi Technologies", url: "https://kamdi-dev.click" }],
  creator: "Kamdi Technologies",
  publisher: "Kamdi Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Kamdi Market",
    title: "Kamdi Market | Enterprise Tech & Cybersecurity Marketplace",
    description: "Government-approved marketplace for enterprise tech solutions, cybersecurity tools, ethical hacking software, and certified unlocked devices.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Kamdi Market - Enterprise Tech Marketplace",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamdi Market | Enterprise Tech & Cybersecurity Marketplace",
    description: "Government-approved marketplace for enterprise tech solutions and cybersecurity tools",
    images: [`${BASE_URL}/twitter-image.jpg`],
    creator: "@kamdi",
    site: "@kamdi",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
      "facebook-domain-verification": process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": `${BASE_URL}/en-US`,
      "es-ES": `${BASE_URL}/es-ES`,
    },
  },
  category: "technology",
  classification: "Enterprise Marketplace",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  appleWebApp: {
    capable: true,
    title: "Kamdi Market",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Kamdi Market",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/shortcut-icon.png"],
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    "msvalidate.01": process.env.NEXT_PUBLIC_MSVALIDATE || "",
    "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect for critical third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ❌ REMOVE these manual font preloads - they cause 404 errors */}
        {/* Next.js font system handles this automatically */}
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Additional SEO meta tags */}
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Palo Alto" />
        <meta name="geo.position" content="37.441883;-122.143019" />
        <meta name="ICBM" content="37.441883, -122.143019" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kamdi Market",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              sameAs: [
                "https://twitter.com/kamdi",
                "https://www.linkedin.com/company/kamdi",
                "https://github.com/kamdi",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-234-567-8900",
                contactType: "customer service",
                availableLanguage: ["English", "Spanish"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Security Blvd",
                addressLocality: "Palo Alto",
                addressRegion: "CA",
                postalCode: "94301",
                addressCountry: "US",
              },
            }),
          }}
        />
        
        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kamdi Market",
              url: BASE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <LoadingBar />
                <Navbar />
                <Suspense fallback={<PageLoader />}>
                  <main className="flex-1">
                    {children}
                  </main>
                </Suspense>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// app/layout.tsx