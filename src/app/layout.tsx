import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { Providers } from "@/components/Providers";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-serif",
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Black Stuff Eesti | Loodusest inspireeritud tooted",
    template: "%s | Black Stuff Eesti",
  },
  description:
    "Black Stuff – looduslikud toidulisandid männikoore ja musta pässiku ekstraktidel. Premium e-pood Eestis.",
  metadataBase: new URL("https://blackstuff.ee"),
  keywords: [
    "Black Stuff",
    "toidulisand",
    "humiinhape",
    "fulviinhape",
    "chaga",
    "männikoor",
    "Eesti",
  ],
  authors: [{ name: "Blackstuff OÜ" }],
  openGraph: {
    title: "Black Stuff Eesti",
    description:
      "Loodusest inspireeritud. Teadlikult loodud. Avasta Black Stuff e-pood.",
    locale: "et_EE",
    type: "website",
    siteName: "Black Stuff Eesti",
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Stuff Eesti",
    description: "Loodusest inspireeritud. Teadlikult loodud.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#263D32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et">
      <body className={`${dmSerif.variable} ${manrope.variable} antialiased`}>
        <OrganizationJsonLd />
        <Providers>
          <SiteShell footer={<Footer />}>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
