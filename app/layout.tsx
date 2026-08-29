import type { Metadata, Viewport } from "next";
import { Golos_Text, JetBrains_Mono, Unbounded } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toasts } from "@/components/toasts";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr. Sushi — суши, роллы и wok в Чирчике",
  description:
    "Аромат Японии в Чирчике. Роллы, суши, сеты и wok с доставкой за 40 минут. Амир Темур, 120 · 10:00–23:00 · 88 345 05 93",
  keywords: ["суши Чирчик", "роллы Чирчик", "доставка суши", "Mr Sushi", "wok"],
  openGraph: {
    title: "Mr. Sushi — суши, роллы и wok в Чирчике",
    description: "Готовим под заказ. Доставка по Чирчику за 40 минут.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0908",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${golos.variable} ${jet.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">
        <Providers>
          {children}
          <Toasts />
        </Providers>
      </body>
    </html>
  );
}
