export type CategoryId = "sets" | "baked" | "salads" | "drinks";

export type Locale = "ru" | "uz";

export type Localized = Record<Locale, string>;

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: Localized;
  description: Localized;
  price: number;
  oldPrice?: number;
  weight: number;
  pieces?: number;
  rating: number;
  reviews: number;
  stock: number;
  spicy?: boolean;
  veg?: boolean;
  hit?: boolean;
  novelty?: boolean;
  art: ArtVariant;
  tone: string;
  /**
   * Путь к фотографии в /public, например "/menu/roll-philadelphia.jpg".
   * Пока не задан — рисуется процедурная иллюстрация FoodArt.
   */
  photo?: string;
  /** Состав блюда — списком, в порядке подачи. */
  ingredients: Record<Locale, string[]>;
  /** Пустой массив = основных аллергенов нет. */
  allergens: AllergenId[];
}

export type AllergenId =
  | "fish"
  | "crustacean"
  | "gluten"
  | "dairy"
  | "egg"
  | "soy"
  | "sesame"
  | "nuts";

export type ArtVariant = "maki" | "nigiri" | "set" | "bowl" | "bite" | "drink";

export interface CartLine {
  id: string;
  qty: number;
}

export interface OrderPayload {
  items: { id: string; qty: number }[];
  customer: {
    name: string;
    phone: string;
    address: string;
    comment?: string;
  };
  delivery: "delivery" | "pickup";
  payment: "cash" | "card" | "click";
  time: string;
  promo?: string;
}

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  bonus: number;
}
