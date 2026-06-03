import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import CJDropshipping from "./pages/CJDropshipping";
import { Stores, Analytics, Automation, Settings } from "./pages/OtherPages";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Layout><Orders /></Layout></PrivateRoute>} />
      <Route path="/stores" element={<PrivateRoute><Layout><Stores /></Layout></PrivateRoute>} />
      <Route path="/cj" element={<PrivateRoute><Layout><CJDropshipping /></Layout></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
      <Route path="/automation" element={<PrivateRoute><Layout><Automation /></Layout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: "600" },
            success: { style: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" } },
            error: { style: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
