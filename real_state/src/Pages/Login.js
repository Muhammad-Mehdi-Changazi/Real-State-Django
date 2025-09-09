import React, { useState, useContext, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../Assets/Background.jpg";
import API from "../Axios/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error before login attempt

    try {
      const response = await API.post("users/login/", formData);
      console.log(response);
      const { refresh, access, user } = response.data;

      if (!access || !user) {
        setError("Login failed. Please check your credentials.");
        return;
      }

      login(refresh, user, access);
      navigate("/dashboard/home");
    } catch (error) {
      console.error(error.response?.data || error.message);

      if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors.join(" "));
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Left Image Section */}
        <div className="w-3/5 relative flex">
          <img
            src={Background}
            alt="Real Estate"
            className="w-full h-[100vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-gray-100"></div>
        </div>

        {/* Right Content Section */}
        
        <div className="w-3/5 flex items-center justify-center px-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Login
            </h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
            >
              Login
            </button>
            <p className="mt-6 text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-700 hover:underline">
                Sign Up
              </Link>
            </p>
            {error && (
              <p className="text-red-600 text-center mb-4">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
