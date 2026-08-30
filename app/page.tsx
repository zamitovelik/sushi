import { Catalog } from "@/components/catalog";
import { Hero } from "@/components/hero";
import { About, Contacts, Delivery, Reviews } from "@/components/sections";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Catalog />
      <About />
      <Delivery />
      <Reviews />
      <Contacts />
    </main>
  );
}
