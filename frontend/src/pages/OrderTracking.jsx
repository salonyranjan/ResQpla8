import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineMinusCircle, HiOutlineClock, HiOutlineTruck } from "react-icons/hi";
import { mockOrders } from "../data/mockData";

// Define possible statuses in order
const STATUS_STEPS = [
  { id: "order_placed", label: "Order Placed", icon: HiOutlineClock },
  { id: "confirmed", label: "Confirmed", icon: HiOutlineCheckCircle },
  { id: "preparing", label: "Preparing", icon: HiOutlineMinusCircle },
  { id: "out_for_delivery", label: "Out for Delivery", icon: HiOutlineTruck },
  { id: "delivered", label: "Delivered", icon: HiOutlineCheckCircle },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Find order from mock data on mount
  useEffect(() => {
    const found = mockOrders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
      // Start at whatever status is stored in mock data (for demo start at 0)
      setCurrentStep(0);
    }
  }, [orderId]);

  // Mock real‑time updates: advance status every 5 seconds
  useEffect(() => {
    if (!order) return;
    if (currentStep >= STATUS_STEPS.length - 1) return; // already delivered
    const timer = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STATUS_STEPS.length - 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [order, currentStep]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link
          to="/dashboard/orders"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 px-4 py-4 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <HiOutlineArrowLeft className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Tracking {order.id}</h1>
      </header>

      {/* Order summary */}
      <section className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-gray-800 mb-2">Delivery Address</h2>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">Items</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tracker */}
      <section className="px-4 pt-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 w-0.5 h-full bg-gray-200" />
          {STATUS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.id} className="flex items-start mb-8">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isCurrent
                        ? "bg-white border-2 border-green-600 text-green-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="text-lg" />
                  </div>
                </div>
                <div className="ml-2">
                  <p className={`font-medium ${isCompleted ? "text-green-600" : "text-gray-800"}`}>\
{step.label}</p>
                  {isCurrent && (
                    <p className="text-sm text-gray-500 mt-1">Updating...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
