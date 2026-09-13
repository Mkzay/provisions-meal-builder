import { SessionWrapper } from "@/components/SessionWrapper";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXTAUTH_URL || "https://provisions-meal-builder.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Provisions — Kitchen Decider & Meal Sanctuary",
    template: "%s | Provisions",
  },
  description:
    "Zero-friction kitchen decider and pantry pairings designed to banish meal fatigue.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Provisions",
    title: "Provisions — Kitchen Decider & Meal Sanctuary",
    description:
      "Zero-friction pantry pairings and ready-meal suggestions to overcome daily meal fatigue.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Provisions — Kitchen Decider & Meal Sanctuary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Provisions — Kitchen Decider & Meal Sanctuary",
    description:
      "Zero-friction pantry pairings and ready-meal suggestions to overcome daily meal fatigue.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Provisions",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col bg-background text-foreground safe-area-bottom safe-area-top selection:bg-saffron-200 selection:text-foreground">
        <SessionWrapper>{children}</SessionWrapper>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration skipped:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
