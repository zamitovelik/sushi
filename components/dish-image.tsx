"use client";

import Image from "next/image";
import { useState } from "react";
import { FoodArt } from "@/components/food-art";
import type { MenuItem } from "@/lib/types";

/**
 * Изображение блюда: фотография, если она есть, иначе процедурная
 * иллюстрация. Единая точка подмены — когда у заведения появятся
 * снимки, менять компоненты карточки и корзины не придётся.
 *
 * onError страхует от битого пути в данных: посетитель увидит
 * иллюстрацию вместо пустого места.
 */
export function DishImage({
  item,
  className = "",
  sizes = "(max-width: 640px) 100vw, 320px",
  priority = false,
}: {
  item: MenuItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!item.photo || failed) {
    return <FoodArt variant={item.art} tone={item.tone} seed={item.id} className={className} />;
  }

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image
        src={item.photo}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </span>
  );
}
