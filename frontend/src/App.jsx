import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Add this

function App() {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Wrap Dashboard in ProtectedRoute */}
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />
      </Routes>
    </>
  );
}

export default App;