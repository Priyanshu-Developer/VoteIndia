"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Squares2X2Icon,
  UserGroupIcon,
  UserPlusIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

type SidebarItemProps = {
  icon: React.ElementType;
  text: string;
  path: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, path }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === path;

  return (
    <li
      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${
        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"
      }`}
      onClick={() => router.push(path)}
    >
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </li>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-3 top-6 w-64 h-[93vh] overflow-y-auto scrollbar-hide bg-white shadow-xl rounded-2xl p-5 flex flex-col">
      {/* Logo */}
      <div>
        <div className="flex items-center space-x-2">
          <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={30} height={30} />
          <h2 className="text-xl font-bold text-gray-700">Vote India Admin</h2>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <p className="text-gray-400 text-sm mb-2">HOME</p>
          <ul className="space-y-2">
            <SidebarItem icon={Squares2X2Icon} text="Dashboard" path="/admin/dashboard" />
          </ul>

          <p className="text-gray-400 text-sm mt-6 mb-2">USER</p>
          <ul className="space-y-2">
            <SidebarItem icon={UserGroupIcon} text="All Users" path="/admin/users" />
            <SidebarItem icon={UserPlusIcon} text="Register User" path="/admin/register-user" />
          </ul>

          <p className="text-gray-400 text-sm mt-6 mb-2">PARTIES</p>
          <ul className="space-y-2">
            <SidebarItem icon={BuildingLibraryIcon} text="All Parties" path="/admin/parties" />
            <SidebarItem icon={ClipboardDocumentCheckIcon} text="Register Party" path="/admin/register-parties" />
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
