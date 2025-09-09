import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Background from "../Assets/Background.jpg";
import API from "../Axios/axios";

const Signup = () => {
    const [successMsg, setSuccess] = useState("");
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      role: "buyer", 
      phone_number: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const response = await API.post("users/register/", formData);

        if (response.status === 201 || response.status === 200) {
          if (response.data.role === "buyer") {
            setSuccess("Account created successfully! You can now login.");
          } else if (response.data.role === "agent") {
            setSuccess("Request sent! Please wait for admin approval.");
          }
        } else {
          setError(" Signup failed. Please try again.");
        }
      } catch (err) {
            console.error(err.response?.data || err.message);

            const data = err.response?.data;

            if (data?.username && data?.email) {
              setError("Username and Email already exist.");
            } else if (data?.username) {
              setError("Username already exists.");
            } else if (data?.email) {
              setError("Email already exists.");
            } else if (data?.detail) {
              setError(data.detail);
            } else {
              setError("Signup failed. Please try again.");
            }
          }      
        finally {
            setLoading(false);
          }
    };

   useEffect(() => {
  if (error || successMsg) {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [error, successMsg]);


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
                Sign Up
              </h2>

              {error && (
                <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
              )}
              {successMsg && (
                <p className="text-green-600 mb-4 text-center font-medium">{successMsg}</p>
              )}

              <div className="flex space-x-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                  required
                />
              </div>

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
              />

              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              >
                <option value="buyer">Buyer</option>
                <option value="agent">Agent</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="mt-6 text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-700 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default Signup;
