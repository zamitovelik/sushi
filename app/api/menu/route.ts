import { NextResponse } from "next/server";
import { CATEGORIES, PRICE_BOUNDS } from "@/lib/data/menu";
import { menuWithLiveStock } from "@/lib/server/store";
import type { MenuItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const SORTS = ["popular", "price-asc", "price-desc", "rating"] as const;
type Sort = (typeof SORTS)[number];

function matches(item: MenuItem, q: string) {
  if (!q) return true;
  const haystack = [
    item.name.ru,
    item.name.uz,
    item.description.ru,
    item.description.uz,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const p = url.searchParams;

  const category = p.get("category") ?? "all";
  const q = (p.get("q") ?? "").trim();
  const min = Number(p.get("min") ?? PRICE_BOUNDS.min);
  const max = Number(p.get("max") ?? PRICE_BOUNDS.max);
  const inStockOnly = p.get("inStock") === "1";
  const spicyOnly = p.get("spicy") === "1";
  const vegOnly = p.get("veg") === "1";
  const sortParam = p.get("sort") as Sort | null;
  const sort: Sort = SORTS.includes(sortParam as Sort) ? (sortParam as Sort) : "popular";

  let items = menuWithLiveStock();

  if (category !== "all") items = items.filter((i) => i.category === category);
  if (q) items = items.filter((i) => matches(i, q));
  if (Number.isFinite(min)) items = items.filter((i) => i.price >= min);
  if (Number.isFinite(max)) items = items.filter((i) => i.price <= max);
  if (inStockOnly) items = items.filter((i) => i.stock > 0);
  if (spicyOnly) items = items.filter((i) => i.spicy);
  if (vegOnly) items = items.filter((i) => i.veg);

  const weight = (i: MenuItem) =>
    (i.hit ? 1000 : 0) + (i.novelty ? 500 : 0) + i.reviews + i.rating * 10;

  items = [...items].sort((a, b) => {
    // товары не в наличии всегда уезжают в конец списка
    if (a.stock === 0 !== (b.stock === 0)) return a.stock === 0 ? 1 : -1;
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating || b.reviews - a.reviews;
      default:
        return weight(b) - weight(a);
    }
  });

  return NextResponse.json({
    ok: true,
    total: items.length,
    bounds: PRICE_BOUNDS,
    categories: CATEGORIES,
    items,
  });
}
