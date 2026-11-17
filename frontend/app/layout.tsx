import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { StoreProvider } from "@/components/StoreProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd } from "@/components/JsonLd";
import { ScrollExtras } from "@/components/ScrollExtras";
import { CursorGlow, SmoothScroll } from "@/components/parallax";
import { getCategories, getSite } from "@/lib/api";
import { buildNav } from "@/lib/nav";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, organizationLd, websiteLd } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Wolf – Your One Stop Shop | Telstra Partner Gippsland", template: "%s | Wolf" },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Wolf",
    "Telstra Partner",
    "Telstra store Traralgon",
    "Telstra store Warragul",
    "Telstra store Torquay",
    "mobile phones Gippsland",
    "iPhone 17",
    "Samsung Galaxy",
    "Google Pixel",
    "smart watches",
    "mobile internet",
    "business telecommunications",
  ],
  authors: [{ name: "Wolf Group of Stores" }],
  creator: "Wolf Group of Stores",
  publisher: "Wolf Group of Stores",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: "/",
    title: "Wolf – Your One Stop Shop",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/uploads/2026/07/hero-banner-bg.jpg", width: 1664, height: 879, alt: "Welcome to WOLF" }],
  },
  twitter: { card: "summary_large_image", title: "Wolf – Your One Stop Shop", description: DEFAULT_DESCRIPTION, images: ["/uploads/2026/07/hero-banner-bg.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "/" },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, categories] = await Promise.all([getSite(), getCategories()]);
  const nav = buildNav(categories);

  return (
    <html lang="en-AU" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-amber focus:px-5 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <JsonLd data={organizationLd(site)} />
        <JsonLd data={websiteLd()} />
        <MotionProvider>
          <StoreProvider>
            <Header nav={nav} logo={site.brand.logo} />
            <main id="main">{children}</main>
            <Footer site={site} />
            <CartDrawer />
            <ScrollExtras />
            <SmoothScroll />
            <CursorGlow />
          </StoreProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
