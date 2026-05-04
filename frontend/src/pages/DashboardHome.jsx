import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineHeart,
  HiOutlineSearch,
  HiOutlineTruck,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { foodListings } from "../data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const DashboardHome = () => {
  const recentListings = foodListings.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 pt-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2"
        >
          Welcome to ResQPlate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-green-100"
        >
          Save food, save lives.
        </motion.p>
      </header>

      {/* Quick Actions */}
      <section className="px-4 -mt-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4"
        >
          {[
            {
              icon: HiOutlinePlusCircle,
              title: "Donate Food",
              desc: "Share your surplus",
              color: "bg-green-100 text-green-700",
              to: "/dashboard/search",
            },
            {
              icon: HiOutlineSearch,
              title: "Find Food",
              desc: "Browse listings",
              color: "bg-blue-100 text-blue-700",
              to: "/dashboard/search",
            },
            {
              icon: HiOutlineTruck,
              title: "Track Order",
              desc: "Live updates",
              color: "bg-orange-100 text-orange-700",
              to: "/dashboard/orders",
            },
            {
              icon: HiOutlineHeart,
              title: "My Donations",
              desc: "View history",
              color: "bg-pink-100 text-pink-700",
              to: "/dashboard/profile",
            },
          ].map((action, idx) => (
            <motion.div key={action.title} variants={itemVariants}>
              <Link to={action.to}>
                <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${action.color}`}
                  >
                    <action.icon className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-800">{action.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recent Listings */}
      <section className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Listings</h2>
          <Link
            to="/dashboard/search"
            className="text-sm text-green-600 font-medium"
          >
            See All
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {recentListings.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm overflow-hidden flex hover:shadow-md transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover"
              />
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.restaurant}</p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-green-600 font-medium">
                    {item.quantity}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">{item.distance}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-4 mt-8 mb-24">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Impact Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "1,200+", label: "Meals Saved" },
              { value: "50+", label: "Partners" },
              { value: "500 kg", label: "CO2 Reduced" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-green-600">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
