import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import { AddressModal } from "@/components/address-modal";
import { AuthModal } from "@/components/auth-modal";
import { CallbackModal } from "@/components/callback-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { Header } from "@/components/header";
import { Intro } from "@/components/intro";
import { ProductModal } from "@/components/product-modal";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/sections";
import { SideMenu } from "@/components/side-menu";
import { INTRO_SEEN_KEY } from "@/lib/intro";
import { Toasts } from "@/components/toasts";
import "./globals.css";

// Один шрифт на весь сайт — как у обоих референсов. Golos Text
// выбран вместо проприетарного DIN: тот же характер гротеска,
// но с полноценной кириллицей.
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr. Sushi — суши, роллы и wok в Чирчике",
  description:
    "Аромат Японии в Чирчике. Роллы, суши, сеты и wok с доставкой за 40 минут. Амир Темур, 120 · 09:00–22:00 · 88 345 05 93",
  keywords: ["суши Чирчик", "роллы Чирчик", "доставка суши", "Mr Sushi", "wok"],
  openGraph: {
    title: "Mr. Sushi — суши, роллы и wok в Чирчике",
    description: "Готовим под заказ. Доставка по Чирчику за 40 минут.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * Общий каркас вынесен в layout: шапка, боковое меню, корзина и модалки
 * нужны и на второстепенных страницах, а не только на главной.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${golos.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Синхронно, до разбора остального body: если заставку в этой
            вкладке уже показывали, она не должна мелькнуть даже кадром. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem(${JSON.stringify(
              INTRO_SEEN_KEY,
            )})==="1")document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
        <Intro />
        {/* Заставку снимает JS: без него она осталась бы белым
            экраном поверх сайта навсегда. */}
        <noscript>
          <style>{`.intro{display:none}`}</style>
        </noscript>

        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />

          <SideMenu />
          <CartDrawer />
          <AuthModal />
          <ProductModal />
          <AddressModal />
          <CallbackModal />
          <Toasts />
        </Providers>
      </body>
    </html>
  );
}
