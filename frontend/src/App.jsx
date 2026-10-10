import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFoodsPage from './pages/admin/AdminFoodsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

function AdminLayout({ children, title }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg text-white">
        <div className="w-10 h-10 border-4 border-brandViolet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
                <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
                <Route path="/food/:slug" element={<CustomerLayout><FoodDetailPage /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
                <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
                <Route path="/order-success/:id" element={<CustomerLayout><OrderSuccessPage /></CustomerLayout>} />
                <Route path="/orders" element={<CustomerLayout><MyOrdersPage /></CustomerLayout>} />
                <Route path="/orders/track/:id" element={<CustomerLayout><OrderTrackingPage /></CustomerLayout>} />
                <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
                <Route path="/addresses" element={<CustomerLayout><AddressesPage /></CustomerLayout>} />
                <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
                <Route path="/register" element={<CustomerLayout><RegisterPage /></CustomerLayout>} />
                <Route path="/forgot-password" element={<CustomerLayout><ForgotPasswordPage /></CustomerLayout>} />
                <Route path="/reset-password" element={<CustomerLayout><ResetPasswordPage /></CustomerLayout>} />
                <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
                <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />

                <Route path="/admin" element={<AdminLayout title="Operational Overview"><AdminDashboardPage /></AdminLayout>} />
                <Route path="/admin/foods" element={<AdminLayout title="Dishes & Menu Management"><AdminFoodsPage /></AdminLayout>} />
                <Route path="/admin/categories" element={<AdminLayout title="Categories Taxonomy"><AdminCategoriesPage /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout title="Order Management"><AdminOrdersPage /></AdminLayout>} />
                <Route path="/admin/customers" element={<AdminLayout title="Customer Directory"><AdminCustomersPage /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout title="Restaurant Configuration"><AdminSettingsPage /></AdminLayout>} />
                <Route path="/admin/analytics" element={<AdminLayout title="Financial Analytics"><AdminAnalyticsPage /></AdminLayout>} />

                <Route path="*" element={<CustomerLayout><NotFoundPage /></CustomerLayout>} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
