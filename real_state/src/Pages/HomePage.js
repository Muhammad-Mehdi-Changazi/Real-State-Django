import React from "react";
import { Link } from "react-router-dom";
import Background from "../Assets/Background.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Left Image Section with gradient overlay */}
        <div className="w-3/5 relative flex">
            <img
            src={Background}
            alt="Real Estate"
            className="w-full h-[100vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-gray-100"></div>

        </div>

        {/* Right Content Section */}
        <div className="w-3/5 flex flex-col items-center justify-center text-center px-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Find Your Dream Home Securely
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8">
            A safe and reliable platform where verified agents and genuine buyers
            connect...
          </p>
          <div className="flex gap-6">
            <Link
              to="/signup"
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
