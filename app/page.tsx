import { AddressModal } from "@/components/address-modal";
import { AuthModal } from "@/components/auth-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { Catalog } from "@/components/catalog";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProductModal } from "@/components/product-modal";
import { About, Contacts, Delivery, Footer, Marquee, Reviews } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Catalog />
        <About />
        <Delivery />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
      <ProductModal />
      <AddressModal />
    </>
  );
}
