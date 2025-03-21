"use client"
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const Navbar: React.FC = () => {
  return (
    <div className="h-16 w-full glassmorphism px-6 py-3 flex items-center justify-between z-50  ">

      {/* Left Section - Search Bar */}
      <div className="relative w-64">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Right Section - Icons, Name & Logout */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="relative">
          <BellIcon className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </button>

        {/* Admin Name */}
        <p className="text-gray-700 font-medium">John Doe</p>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
          <img src="https://i.pravatar.cc/40" alt="User" />
        </div>
        {/* Logout Button */}
        <button className="bg-red-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;
