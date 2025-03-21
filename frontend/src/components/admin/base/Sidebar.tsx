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
import { div } from "framer-motion/client";

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
        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-400 text-gray-600"
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
    <div className="min-h-full w-60 glassmorphism overflow-y-auto scrollbar-hide shadow-xl pt-10  rounded-2xl p-5 m-2  ">
       <div>
        <div className="flex items-center space-x-2">
          <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={30} height={30} />
          <h2 className="text-xl font-bold text-gray-600">Vote India Admin</h2>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <p className="text-gray-400 text-sm mb-2">HOME</p>
          <ul className="space-y-2">
            <SidebarItem icon={Squares2X2Icon} text="Dashboard" path="/admin/dashboard" />
          </ul>

          <p className="text-gray-400 text-sm mt-6 mb-2">USER</p>
          <ul className="space-y-2">
            <SidebarItem icon={UserGroupIcon} text="Voters" path="/admin/users/voters" />
            <SidebarItem icon={UserPlusIcon} text="Admin" path="/admin/users/admin" />
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
