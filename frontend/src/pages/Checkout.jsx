import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { HiOutlineArrowLeft, HiOutlineCheckCircle } from "react-icons/hi";

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: confirmation
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("free"); // free for donations
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
    setStep(3);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-4 shadow-sm flex items-center gap-3">
        <button onClick={() => (step > 1 && !orderPlaced ? setStep(step - 1) : navigate(-1))} className="p-1">
          <HiOutlineArrowLeft className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          {step === 1
            ? "Delivery Address"
            : step === 2
            ? "Payment"
            : "Order Confirmed"}
        </h1>
      </header>

      {/* Stepper */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-center gap-2">
          {["Address", "Payment", "Confirm"].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > idx + 1
                    ? "bg-green-600 text-white"
                    : step === idx + 1
                    ? "bg-green-100 text-green-700 border-2 border-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > idx + 1 ? <HiOutlineCheckCircle /> : idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-1 ${
                    step > idx + 1 ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 pt-6"
      >
        {/* Step 1: Address */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">
                Delivery Address
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {[
                  {
                    id: "free",
                    label: "Free Donation",
                    desc: "All food donations are free",
                  },
                  {
                    id: "paypal",
                    label: "PayPal",
                    desc: "Pay with PayPal (mock)",
                  },
                  {
                    id: "card",
                    label: "Credit/Debit Card",
                    desc: "Pay with card (mock)",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      paymentMethod === method.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-bold text-gray-800">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-gray-800 font-medium">Free</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-600">
                      {totalItems} items (Free)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
            >
              Place Order
            </button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center py-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 mb-1">
              Order ID: <span className="font-bold">{orderId}</span>
            </p>
            <p className="text-gray-400 text-sm mb-8">
              You will receive updates about your order.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/tracking/${orderId}`)}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition"
              >
                Track Order
              </button>
              <Link to="/dashboard">
                <button className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
