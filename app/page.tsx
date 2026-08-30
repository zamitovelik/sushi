import { Catalog } from "@/components/catalog";
import { Hero } from "@/components/hero";
import { About, Contacts, Delivery, Marquee, Reviews } from "@/components/sections";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Catalog />
      <About />
      <Delivery />
      <Reviews />
      <Contacts />
    </main>
  );
}
