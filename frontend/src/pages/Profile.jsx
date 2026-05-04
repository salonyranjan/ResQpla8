import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineClipboardList, HiOutlineLogout } from "react-icons/hi";
import { currentUser } from "../data/mockData";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 pt-10">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full border-4 border-white"
          />
          <div>
            <h1 className="text-xl font-bold">{currentUser.name}</h1>
            <p className="text-green-100 text-sm">{currentUser.email}</p>
          </div>
        </div>
      </header>

      {/* Actions */}
      <section className="px-4 mt-6 space-y-3">
        {[
          { icon: HiOutlineUser, label: "My Donations", to: "/dashboard/orders" },
          { icon: HiOutlineClipboardList, label: "Order History", to: "/dashboard/orders" },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <action.icon className="text-2xl text-green-600" />
            <span className="font-medium text-gray-800">{action.label}</span>
          </Link>
        ))}

        <button className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition w-full">
          <HiOutlineLogout className="text-2xl text-red-500" />
          <span className="font-medium text-red-500">Logout</span>
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
