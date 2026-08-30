"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type TranslationKey } from "@/lib/i18n";
import type { PickedAddress } from "@/lib/geo";
import type { CartLine, Locale, PublicUser } from "@/lib/types";

/* ─────────────────────────── locale ─────────────────────────── */

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleCtx | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale вне провайдера");
  return ctx;
}

/* ─────────────────────────── toasts ─────────────────────────── */

export interface Toast {
  id: number;
  text: string;
  tone: "ok" | "err";
}

interface ToastCtx {
  toasts: Toast[];
  push: (text: string, tone?: Toast["tone"]) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast вне провайдера");
  return ctx;
}

/* ──────────────────────────── cart ──────────────────────────── */

interface CartCtx {
  lines: CartLine[];
  count: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
  promo: string | null;
  setPromo: (code: string | null) => void;
  hydrated: boolean;
}

const CartContext = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart вне провайдера");
  return ctx;
}

/* ──────────────────────────── auth ──────────────────────────── */

export interface OrderSummary {
  id: string;
  number: string;
  createdAt: string;
  total: number;
  status: string;
  items: { id: string; name: string; qty: number; price: number }[];
}

interface AuthCtx {
  user: PublicUser | null;
  orders: OrderSummary[];
  loading: boolean;
  refresh: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<AuthResult>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

export type AuthResult =
  | { ok: true; user: PublicUser }
  | { ok: false; error: string; fields?: Record<string, string> };

const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth вне провайдера");
  return ctx;
}

/* ─────────────────────────── адрес ─────────────────────────── */

interface AddressCtx {
  address: PickedAddress | null;
  setAddress: (value: PickedAddress | null) => void;
}

const AddressContext = createContext<AddressCtx | null>(null);

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddress вне провайдера");
  return ctx;
}

/* ───────────────────────────── ui ───────────────────────────── */

interface UICtx {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  authOpen: false | "login" | "register";
  setAuthOpen: (v: false | "login" | "register") => void;
  /** id блюда, открытого в карточке, или null */
  detailsId: string | null;
  setDetailsId: (id: string | null) => void;
  addressOpen: boolean;
  setAddressOpen: (v: boolean) => void;
}

const UIContext = createContext<UICtx | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI вне провайдера");
  return ctx;
}

/* ────────────────────────── provider ────────────────────────── */

const CART_KEY = "mrsushi.cart.v1";
const ADDRESS_KEY = "mrsushi.address.v1";
const PROMO_KEY = "mrsushi.promo.v1";
const LOCALE_KEY = "mrsushi.locale.v1";

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [promo, setPromoState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState<false | "login" | "register">(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddressState] = useState<PickedAddress | null>(null);

  /* Восстановление из localStorage. Читать его во время рендера нельзя —
     на сервере его нет, и разметка разъедется при гидратации. */
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage недоступен на сервере, читаем только после монтирования */
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) setLines(JSON.parse(savedCart) as CartLine[]);
      const savedPromo = localStorage.getItem(PROMO_KEY);
      if (savedPromo) setPromoState(savedPromo);
      const savedAddress = localStorage.getItem(ADDRESS_KEY);
      if (savedAddress) setAddressState(JSON.parse(savedAddress) as PickedAddress);
      const savedLocale = localStorage.getItem(LOCALE_KEY);
      if (savedLocale === "ru" || savedLocale === "uz") setLocaleState(savedLocale);
    } catch {
      /* приватный режим — просто стартуем с чистого состояния */
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* игнорируем */
    }
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (promo) localStorage.setItem(PROMO_KEY, promo);
      else localStorage.removeItem(PROMO_KEY);
    } catch {
      /* игнорируем */
    }
  }, [promo, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* игнорируем */
    }
  }, []);

  const setAddress = useCallback((value: PickedAddress | null) => {
    setAddressState(value);
    try {
      if (value) localStorage.setItem(ADDRESS_KEY, JSON.stringify(value));
      else localStorage.removeItem(ADDRESS_KEY);
    } catch {
      /* приватный режим — адрес просто не запомнится */
    }
  }, []);

  const t = useCallback((key: TranslationKey) => dict[key][locale], [locale]);

  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.id === id);
      if (existing) {
        return prev.map((line) =>
          line.id === id ? { ...line, qty: line.qty + qty } : line,
        );
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.id !== id)
        : prev.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPromoState(null);
  }, []);

  const qtyOf = useCallback(
    (id: string) => lines.find((line) => line.id === id)?.qty ?? 0,
    [lines],
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
      setOrders(data.orders ?? []);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refresh асинхронный: setState происходит после await
    void refresh();
  }, [refresh]);

  const login = useCallback<AuthCtx["login"]>(
    async (payload) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? "unknown", fields: data.fields };
      }
      setUser(data.user);
      await refresh();
      return { ok: true, user: data.user };
    },
    [refresh],
  );

  const register = useCallback<AuthCtx["register"]>(
    async (payload) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? "unknown", fields: data.fields };
      }
      setUser(data.user);
      await refresh();
      return { ok: true, user: data.user };
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
  }, []);

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines]);

  const localeValue = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  const toastValue = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);
  const cartValue = useMemo(
    () => ({
      lines,
      count,
      add,
      setQty,
      remove,
      clear,
      qtyOf,
      promo,
      setPromo: setPromoState,
      hydrated,
    }),
    [lines, count, add, setQty, remove, clear, qtyOf, promo, hydrated],
  );
  const authValue = useMemo(
    () => ({ user, orders, loading, refresh, login, register, logout }),
    [user, orders, loading, refresh, login, register, logout],
  );
  const uiValue = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      authOpen,
      setAuthOpen,
      detailsId,
      setDetailsId,
      addressOpen,
      setAddressOpen,
    }),
    [cartOpen, authOpen, detailsId, addressOpen],
  );

  const addressValue = useMemo(() => ({ address, setAddress }), [address, setAddress]);

  return (
    <LocaleContext.Provider value={localeValue}>
      <ToastContext.Provider value={toastValue}>
        <AuthContext.Provider value={authValue}>
          <CartContext.Provider value={cartValue}>
            <AddressContext.Provider value={addressValue}>
              <UIContext.Provider value={uiValue}>{children}</UIContext.Provider>
            </AddressContext.Provider>
          </CartContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    </LocaleContext.Provider>
  );
}
