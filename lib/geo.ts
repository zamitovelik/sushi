/** Центр Чирчика — точка по умолчанию на карте. */
export const CHIRCHIQ = { lat: 41.4689, lng: 69.5822 };

/** Заведение: Амир Темур, 120. Координаты приблизительные — уточнить у заведения. */
export const RESTAURANT = { lat: 41.4703, lng: 69.582 };

/** Радиус доставки в километрах: дальше курьер не едет. */
export const DELIVERY_RADIUS_KM = 12;

export interface PickedAddress {
  lat: number;
  lng: number;
  text: string;
}

/** Расстояние по прямой между двумя точками, км (формула гаверсинуса). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function isInDeliveryZone(point: { lat: number; lng: number }) {
  return distanceKm(RESTAURANT, point) <= DELIVERY_RADIUS_KM;
}

/**
 * Обратное геокодирование через Nominatim (OpenStreetMap).
 * Бесплатно и без ключа, но с лимитом ~1 запрос в секунду и требованием
 * указывать себя в User-Agent. Для боевого трафика нужен Яндекс.Геокодер
 * с ключом — здесь этого достаточно, чтобы подставить адрес в поле.
 *
 * Никогда не бросает: если сервис недоступен, гость просто впишет адрес руками.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  locale: "ru" | "uz",
): Promise<string | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("zoom", "18");
    url.searchParams.set("accept-language", locale);

    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = data.address ?? {};

    // собираем короткий человеческий адрес вместо полного display_name
    const street = a.road ?? a.pedestrian ?? a.neighbourhood ?? a.suburb;
    const house = a.house_number;
    const city = a.city ?? a.town ?? a.village;

    const parts = [city, street, house].filter(Boolean);
    if (parts.length >= 2) return parts.join(", ");
    return data.display_name ?? null;
  } catch {
    return null;
  }
}
