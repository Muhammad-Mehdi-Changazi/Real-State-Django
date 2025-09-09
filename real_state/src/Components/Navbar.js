import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react"; // Added User icon
import { AuthContext } from "../context/AuthContext"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const buttonClasses = ({ isActive }) =>
    isActive
      ? "px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg"
      : "px-4 py-2 text-white border border-white rounded-lg hover:bg-purple-600 transition";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-purple-700 py-2 px-8 flex justify-between items-center text-white relative">
        {/* Logo + Subtitle */}
        <NavLink to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-10 h-10 text-white"
            fill="currentColor"
          >
            <path d="M32 12L8 32h6v20h12V40h12v12h12V32h6L32 12z" />
            <path
              d="M50 10l-2 6-6 2 6 2 2 6 2-6 6-2-6-2-2-6z"
              className="text-yellow-400"
              fill="currentColor"
            />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold">Real Partner</span>
            <span className="text-sm text-gray-200">Lets Find You Home!</span>
          </div>
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          
          {user && user.first_name && user.last_name ? (
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center">
                <User size={20} /> {/* Profile icon */}
                <span className="text-xs">
                  {user.role === "buyer" ? "Buyer" : user.role === "agent" ? "Agent" : ""}
                </span>
              </div>
              <span className="font-semibold">
                {user.first_name} {user.last_name}
              </span>
            </div>
          ) : (
            <div className="flex space-x-4">
              <NavLink to="/login" className={buttonClasses}>Login</NavLink>
              <NavLink to="/signup" className={buttonClasses}>Sign Up</NavLink>
            </div>
          )}


          <button onClick={() => setIsOpen(true)} className="text-white focus:outline-none">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}></div>}

      {/* Slide-in Sidebar */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-between items-center p-5 bg-purple-700 text-white">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setIsOpen(false)}><X size={24} /></button>
        </div>

        <nav className="flex flex-col p-4 space-y-4 text-gray-700">
          {["About", "FAQs", "Contact", "Blogs", "Terms & Policies"].map((label, idx) => {
            const path = `/${label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "")}`;
            return (
              <NavLink
                key={idx}
                to={path}
                onClick={() => setIsOpen(false)}
                className="relative text-gray-700 hover:text-purple-700 transition duration-200 
                           after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                           after:bg-purple-700 after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </NavLink>
            );
          })}

          {user && (
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mt-4"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
