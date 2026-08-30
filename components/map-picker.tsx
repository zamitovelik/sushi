"use client";

import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { CHIRCHIQ, DELIVERY_RADIUS_KM, RESTAURANT } from "@/lib/geo";

/**
 * Карта на Leaflet + тайлы OpenStreetMap: без API-ключа и без привязки
 * к аккаунту. Яндекс.Карты дали бы лучшее покрытие Узбекистана, но требуют
 * ключ — переключение это замена источника тайлов в одном месте.
 *
 * Leaflet трогает window, поэтому грузится динамическим импортом уже
 * после монтирования: на сервере его импортировать нельзя.
 */
export function MapPicker({
  value,
  onPick,
  interactive = true,
  className = "",
}: {
  value: { lat: number; lng: number } | null;
  onPick?: (point: { lat: number; lng: number }) => void;
  interactive?: boolean;
  className?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  // держим колбэк в ref, чтобы не пересоздавать карту при каждом рендере
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || mapRef.current) return;

      const start = value ?? (interactive ? CHIRCHIQ : RESTAURANT);
      const map = L.map(holder.current, {
        center: [start.lat, start.lng],
        zoom: interactive ? 14 : 16,
        zoomControl: interactive,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const pin = L.divIcon({
        className: "",
        html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:#e12b24;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });

      if (interactive) {
        // зона доставки — чтобы гость сразу видел, куда возят
        L.circle([RESTAURANT.lat, RESTAURANT.lng], {
          radius: DELIVERY_RADIUS_KM * 1000,
          color: "#e12b24",
          weight: 1,
          fillColor: "#e12b24",
          fillOpacity: 0.05,
        }).addTo(map);

        const marker = L.marker([start.lat, start.lng], { icon: pin, draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on("dragend", () => {
          const p = marker.getLatLng();
          onPickRef.current?.({ lat: p.lat, lng: p.lng });
        });
        map.on("click", (event) => {
          marker.setLatLng(event.latlng);
          onPickRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
        });
      } else {
        L.marker([RESTAURANT.lat, RESTAURANT.lng], { icon: pin }).addTo(map);
      }

      // контейнер часто монтируется скрытым (модалка) — размер надо пересчитать
      setTimeout(() => map.invalidateSize(), 60);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // карта создаётся один раз; координаты синхронизируются эффектом ниже
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // внешнее изменение точки (например, «моё местоположение») двигает метку
  useEffect(() => {
    if (!value || !markerRef.current || !mapRef.current) return;
    markerRef.current.setLatLng([value.lat, value.lng]);
    mapRef.current.panTo([value.lat, value.lng]);
  }, [value]);

  return <div ref={holder} className={className} />;
}
