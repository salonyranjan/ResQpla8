// cart-context.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

// ─── Types (JSDoc) ───────────────────────────────────────────────────────────

/**
 * @typedef {{ id: string|number, name: string, price: number, [key: string]: any }} Product
 * @typedef {{ quantity: number } & Product} CartItem
 * @typedef {{
 *   items: CartItem[],
 *   addItem: (product: Product, quantity?: number) => void,
 *   removeItem: (productId: string|number) => void,
 *   updateQuantity: (productId: string|number, quantity: number) => void,
 *   clearCart: () => void,
 *   totalItems: number,
 *   totalPrice: number,
 *   isEmpty: boolean,
 * }} CartContextValue
 */

// ─── Storage helpers (safe, no side-effect leaks) ────────────────────────────

const STORAGE_KEY = 'cart_v1';

function readStorage() {
  try {
    const raw = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Quota exceeded or private-browsing restriction — fail silently
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

const MAX_QUANTITY = 99;

/** @param {CartItem[]} state @param {{ type: string, payload?: any }} action */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const qty = Math.max(1, Math.min(MAX_QUANTITY, quantity));
      const idx = state.findIndex((i) => i.id === product.id);

      if (idx !== -1) {
        return state.map((item, i) =>
          i === idx
            ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + qty) }
            : item,
        );
      }
      return [...state, { ...product, quantity: qty }];
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.payload.productId);

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1) return state.filter((i) => i.id !== productId);
      return state.map((i) =>
        i.id === productId
          ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) }
          : i,
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

// Wraps reducer with a write-through to localStorage on every state change
function useCartReducer() {
  const [items, dispatch] = useReducer(cartReducer, undefined, readStorage);

  const persistingDispatch = useCallback(
    (action) => {
      dispatch((prevItems) => {
        const nextItems = cartReducer(prevItems, action);
        writeStorage(nextItems);
        return nextItems;
      });
    },
    [],
  );

  return [items, persistingDispatch];
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext(/** @type {CartContextValue | null} */ (null));
CartContext.displayName = 'CartContext';

// ─── Provider ────────────────────────────────────────────────────────────────

/** @param {{ children: React.ReactNode }} props */
export function CartProvider({ children }) {
  const [items, dispatch] = useCartReducer();

  const addItem = useCallback(
    (product, quantity = 1) =>
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
    [dispatch],
  );

  const removeItem = useCallback(
    (productId) =>
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
    [dispatch],
  );

  const updateQuantity = useCallback(
    (productId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    [dispatch],
  );

  const clearCart = useCallback(
    () => dispatch({ type: 'CLEAR_CART' }),
    [dispatch],
  );

  // Derived selectors — recomputed only when `items` changes
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const isEmpty = items.length === 0;

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isEmpty,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isEmpty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Primary hook — full cart state and actions.
 * Throws if used outside <CartProvider>.
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

/**
 * Focused selector hook — prevents re-renders in components that only care
 * about one item's quantity.
 * @param {string|number} productId
 */
export function useCartItem(productId) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const item = useMemo(
    () => items.find((i) => i.id === productId) ?? null,
    [items, productId],
  );
  return { item, addItem, removeItem, updateQuantity };
}

/**
 * Read-only summary hook — safe for nav bars and badges.
 * Components using this will NOT re-render on every item quantity change,
 * only when totalItems/totalPrice/isEmpty changes.
 */
export function useCartSummary() {
  const { totalItems, totalPrice, isEmpty } = useCart();
  return { totalItems, totalPrice, isEmpty };
}