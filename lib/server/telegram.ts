import { formatSum } from "@/lib/pricing";

/**
 * Отправка заказа в Telegram-бот администратора.
 *
 * Принцип: падение Telegram никогда не должно ронять заказ. Гость своё
 * оформление уже завершил, деньги кухня получит в любом случае — поэтому
 * любая ошибка здесь только логируется, а вызывающий код её не ждёт.
 */

export interface OrderNotification {
  number: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promo: string | null;
  customer: { name: string; phone: string; address: string; comment: string };
  delivery: "delivery" | "pickup";
  payment: string;
  time: string;
  etaMinutes: number;
}

const PAYMENT_LABEL: Record<string, string> = {
  cash: "наличные",
  card: "карта курьеру",
  click: "Click / Payme",
};

/** Telegram ломается на сырых < > &, если parse_mode = HTML. */
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildMessage(order: OrderNotification) {
  const lines = [
    `<b>Новый заказ ${escapeHtml(order.number)}</b>`,
    "",
    ...order.items.map(
      (item) =>
        `• ${escapeHtml(item.name)} × ${item.qty} — ${formatSum(item.price * item.qty)}`,
    ),
    "",
    `Товары: ${formatSum(order.subtotal)}`,
  ];

  if (order.discount > 0) {
    lines.push(`Скидка${order.promo ? ` (${escapeHtml(order.promo)})` : ""}: −${formatSum(order.discount)}`);
  }
  lines.push(
    `Доставка: ${order.deliveryFee === 0 ? "бесплатно" : formatSum(order.deliveryFee)}`,
    `<b>Итого: ${formatSum(order.total)} сум</b>`,
    "",
    `Гость: ${escapeHtml(order.customer.name)}`,
    `Телефон: ${escapeHtml(order.customer.phone)}`,
    order.delivery === "pickup"
      ? "Самовывоз: Амир Темур, 120"
      : `Адрес: ${escapeHtml(order.customer.address)}`,
    `Время: ${order.time === "asap" ? `как можно скорее (~${order.etaMinutes} мин)` : escapeHtml(order.time)}`,
    `Оплата: ${PAYMENT_LABEL[order.payment] ?? escapeHtml(order.payment)}`,
  );

  if (order.customer.comment) {
    lines.push("", `Комментарий: ${escapeHtml(order.customer.comment)}`);
  }

  return lines.join("\n");
}

export async function notifyTelegram(order: OrderNotification): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      `[mrsushi] заказ ${order.number}: Telegram не настроен (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID), уведомление пропущено`,
    );
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(order),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // без таймаута зависший Telegram держал бы соединение до упора
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[mrsushi] Telegram отклонил заказ ${order.number}: HTTP ${response.status} ${body.slice(0, 200)}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[mrsushi] Telegram недоступен для заказа ${order.number}:`, error);
    return false;
  }
}
