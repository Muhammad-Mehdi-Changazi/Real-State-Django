import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Heart,
  Sliders,
  Calendar,
  MessageCircle,
  Settings,
  Users,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition w-full
     ${
       isActive
         ? "bg-purple-600 text-white shadow-md"
         : "bg-gray-200 text-gray-800 hover:bg-purple-100 hover:text-purple-700"
     }`;

  // Role-based link definitions
  const agentLinks = [
    { to: "/dashboard/home", label: "Home", icon: <Home size={18} /> },
    { to: "/dashboard/your-properties", label: "Your Properties", icon: <Briefcase size={18} /> },
    { to: "/dashboard/contacts", label: "Contacts", icon: <Users size={18} /> },
    { to: "/dashboard/ongoing-deals", label: "Ongoing Deals", icon: <BookOpen size={18} /> },
    { to: "/dashboard/past-deals", label: "Past Deals", icon: <BookOpen size={18} /> },
    { to: "/dashboard/appointments", label: "Appointments", icon: <Calendar size={18} /> },
    { to: "/dashboard/chats", label: "Chats", icon: <MessageCircle size={18} /> },
    { to: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const buyerLinks = [
    { to: "/dashboard/home", label: "Home", icon: <Home size={18} /> },
    { to: "/dashboard/saved-properties", label: "Saved Properties", icon: <Heart size={18} /> },
    { to: "/dashboard/ongoing-deals", label: "Ongoing Deals", icon: <BookOpen size={18} /> },
    { to: "/dashboard/preferences", label: "Preferences", icon: <Sliders size={18} /> },
    { to: "/dashboard/appointments", label: "Appointments", icon: <Calendar size={18} /> },
    { to: "/dashboard/chats", label: "Chats", icon: <MessageCircle size={18} /> },
    { to: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  let sidebarLinks = [];

  if (user?.role === "agent") {
    sidebarLinks = agentLinks;
  } else if (user?.role === "buyer") {
    sidebarLinks = buyerLinks;
  }

  return (
    <aside className="w-64 bg-gray-100 flex flex-col h-screen border-t border-r border-gray-300">
      <nav className="flex-1 px-4 py-6 space-y-3">
        {sidebarLinks.length > 0 ? (
          sidebarLinks.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              {icon} <span>{label}</span>
            </NavLink>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            Please log in to see your menu
          </p>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
