import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CartItem = {
  uid: string;
  productId: string;
  name: string;
  image: string; // küçük görsel yolu
  price: number | null;
  options: Record<string, string>; // seçenek anahtarı → seçilen değer
  extras?: string[];
  text: string; // kişiselleştirme metni
  textLabel: string;
  qty: number;
};

type Ui = { cart: boolean; checkout: boolean; productId: string | null; legal: 'gizlilik' | 'yasal' | null };

type Store = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, 'uid'>) => void;
  remove: (uid: string) => void;
  setQty: (uid: string, qty: number) => void;
  update: (uid: string, patch: Partial<CartItem>) => void;
  clear: () => void;
  ui: Ui;
  setUi: (patch: Partial<Ui>) => void;
  toast: string | null;
  notify: (msg: string) => void;
};

const KEY = 'edora-sepet-v1';
const Ctx = createContext<Store | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);
  const [ui, setUiState] = useState<Ui>({ cart: false, checkout: false, productId: null, legal: null });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* depolama kapalıysa sepet yalnızca bu oturumda tutulur */
    }
  }, [items]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((item: Omit<CartItem, 'uid'>) => {
    setItems((prev) => [...prev, { ...item, uid: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}` }]);
  }, []);
  const remove = useCallback((uid: string) => setItems((p) => p.filter((i) => i.uid !== uid)), []);
  const setQty = useCallback(
    (uid: string, qty: number) => setItems((p) => p.map((i) => (i.uid === uid ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i))),
    [],
  );
  const update = useCallback((uid: string, patch: Partial<CartItem>) => setItems((p) => p.map((i) => (i.uid === uid ? { ...i, ...patch } : i))), []);
  const clear = useCallback(() => setItems([]), []);
  const setUi = useCallback((patch: Partial<Ui>) => setUiState((u) => ({ ...u, ...patch })), []);

  const value = useMemo<Store>(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), add, remove, setQty, update, clear, ui, setUi, toast, notify: setToast }),
    [items, add, remove, setQty, update, clear, ui, setUi, toast],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider eksik');
  return s;
}
