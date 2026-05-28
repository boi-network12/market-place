import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ MOVED viewport configuration to separate export
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

// ✅ REMOVED viewport from metadata (no longer nested inside)
export const metadata: Metadata = {
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
    url: "https://market.kamdi-dev.click",
    siteName: "Kamdi Market",
    title: "Kamdi Market | Enterprise Tech & Cybersecurity Marketplace",
    description: "Government-approved marketplace for enterprise tech solutions, cybersecurity tools, ethical hacking software, and certified unlocked devices.",
    images: [
      {
        url: "https://market.kamdi-dev.click/og-image.jpg",
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
    images: ["https://market.kamdi-dev.click/twitter-image.jpg"],
    creator: "@kamdi",
    site: "@kamdi",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },
  alternates: {
    canonical: "https://market.kamdi-dev.click",
    languages: {
      "en-US": "https://market.kamdi-dev.click/en-US",
      "es-ES": "https://market.kamdi-dev.click/es-ES",
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
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}