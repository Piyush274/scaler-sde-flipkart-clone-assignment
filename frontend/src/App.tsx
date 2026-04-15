import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/services/http";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const hydrateFromBackend = useCartStore((s) => s.hydrateFromBackend);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verify session on app load if user is marked as authenticated
    const verifySession = async () => {
      if (isAuthenticated) {
        try {
          // Try to fetch cart to verify the session is valid
          await api.get("/cart");
          // If successful, hydrate the cart
          await hydrateFromBackend();
        } catch (error: any) {
          // If any error (including 401), clear auth state
          if (error.response?.status === 401) {
            logout();
            clearCart();
          }
        }
      } else {
        clearCart();
      }
      setIsInitialized(true);
    };

    verifySession();
  }, [isAuthenticated, logout, hydrateFromBackend, clearCart]);

  // Show nothing while verifying session to prevent 401 errors from showing
  if (!isInitialized) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <AppRoutes />
  </QueryClientProvider>
);

export default App;
