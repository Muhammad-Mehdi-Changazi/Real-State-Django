// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/SideBar";
import Home from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import DashboardHome from "./Pages/DashBoard";
import ProtectedRoute from "./common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import YourProperties from "./Pages/AgentPages/YourProperties";
import SavedProperties from "./Pages/BuyerPages/SavedProperties";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar className="bg-gray-800" />
                  <main className="flex-1 p-6 overflow-y-auto bg-white">
                    <Routes>
                      <Route path="home" element={<DashboardHome />} />
                      <Route path="your-properties" element={<YourProperties />} />
                      <Route path="saved-properties" element={<SavedProperties />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
