import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { HiOutlineArrowLeft, HiOutlineTrash } from "react-icons/hi";

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, addItem } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * 0,
    0
  ); // free donations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Browse food listings and add items to your cart
        </p>
        <Link
          to="/dashboard/search"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Browse Food
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-4 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <HiOutlineArrowLeft className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          My Cart ({totalItems} items)
        </h1>
      </header>

      {/* Cart items */}
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-2xl p-4 shadow-sm flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.restaurant}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-600 font-bold">{item.quantity}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600"
                    >
                      -
                    </button>
                    <span className="font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="self-start text-gray-400 hover:text-red-500 transition p-1"
              >
                <HiOutlineTrash className="text-xl" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clear cart */}
      <div className="px-4 pt-4">
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Total Items</span>
            <span className="font-bold text-gray-800">{totalItems}</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">All donations are free</p>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
