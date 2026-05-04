import { useState, useMemo } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "../components/FoodCard";
import { foodListings, categories } from "../data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
};

const FoodListing = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return foodListings.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search header */}
      <div className="sticky top-0 bg-white z-40 px-4 pt-4 pb-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Find Food</h1>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search food, restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
          results found
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-sm text-green-600 font-medium"
        >
          <HiOutlineFilter /> Filters
        </button>
      </div>

      {/* Food grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-4 pb-24 grid grid-cols-2 gap-3"
      >
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FoodCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 text-lg">No food listings found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FoodListing;
