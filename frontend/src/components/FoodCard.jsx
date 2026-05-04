import { Link } from "react-router-dom";
import { HiOutlineLocationMarker, HiStar } from "react-icons/hi";
import { useCart } from "../context/CartContext";

const FoodCard = ({ item, onAddToCart }) => {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  };

  return (
    <Link
      to={`/dashboard/search/${item.id}`}
      className="block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {item.category}
        </span>
        <button
          onClick={handleAdd}
          className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-green-50 transition"
        >
          <span className="text-green-600 font-bold text-lg">+</span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{item.restaurant}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <HiOutlineLocationMarker className="text-green-500 mr-1" />
            {item.distance}
          </div>
          <div className="flex items-center">
            <HiStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {item.rating}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-medium text-green-600">
            {item.quantity}
          </span>
          <span className="text-xs text-gray-400">
            Expires in {item.expiresIn}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
