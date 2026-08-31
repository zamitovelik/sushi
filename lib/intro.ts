/**
 * Ключ живёт отдельно от компонента: layout — серверный, а из модуля
 * с "use client" в него приезжает не значение, а клиентская ссылка,
 * и на сервере константа оказывалась undefined.
 */
export const INTRO_SEEN_KEY = "mrsushi:intro-seen";
