import React, { useState } from 'react';
import { useEffect } from "react";
import { getFoods, addFood as apiAddFood, updateFood as apiUpdateFood, deleteFood as apiDeleteFood } from "./api/food";
import { placeOrder as apiPlaceOrder, getOrders as apiGetOrders, updateOrderStatus as apiUpdateOrderStatus } from "./api/order";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import { INITIAL_FOOD_ITEMS, INITIAL_ORDERS, CATEGORIES_WITH_EMOJIS } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [foods, setFoods] = useState(INITIAL_FOOD_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Top-level Toast Notification State
  const [notification, setNotification] = useState(null);

  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      // Backend returns { success, count, foods: [...] }
      // Normalize MongoDB _id to id for consistent use across the app
      const normalized = res.data.foods.map((f) => ({
        ...f,
        id: f._id,
        prepTime: f.prepTime || '15-20 mins',
        rating: f.rating || 4.5,
      }));
      setFoods(normalized);
    } catch (err) {
      console.log("Failed to load foods from server, using local data.", err);
    }
  };

  fetchFoods();
}, []);


  // Routing synchronization effect
  React.useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#/admin') {
        if (currentUser && currentUser.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else {
          // If not logged in as admin, redirect to login page
          setCurrentPage('login');
          setTimeout(() => {
            showToast('Please login with admin credentials to access the Admin Panel.', 'info');
          }, 100);
        }
      } else if (path === '/dashboard' || hash === '#/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/cart' || hash === '#/cart') {
        setCurrentPage('cart');
      } else if (path === '/login' || hash === '#/login') {
        setCurrentPage('login');
      } else if (path === '/register' || hash === '#/register') {
        setCurrentPage('register');
      } else if (path === '/order-success' || hash === '#/order-success') {
        setCurrentPage('order-success');
      } else if (path === '/' || hash === '#/' || hash === '') {
        setCurrentPage('home');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);
    return () => {
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('hashchange', handleRouting);
    };
  }, [currentUser]);

  // Sync state changes back to browser location
  React.useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    let targetPath = '/';
    if (currentPage === 'admin-dashboard') targetPath = '/admin';
    else if (currentPage === 'dashboard') targetPath = '/dashboard';
    else if (currentPage === 'cart') targetPath = '/cart';
    else if (currentPage === 'login') targetPath = '/login';
    else if (currentPage === 'register') targetPath = '/register';
    else if (currentPage === 'order-success') targetPath = '/order-success';

    if (path !== targetPath && hash !== `#${targetPath}`) {
      window.history.pushState({}, '', targetPath);
    }
  }, [currentPage]);

  // Helper to trigger custom styled banner toast notifications
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Add Item to Cart
  const handleAddToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.food.id === food.id);
      if (existingItem) {
        showToast(`Increased quantity of ${food.name} in your cart!`, 'info');
        return prevCart.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`Added ${food.name} to your cart!`, 'success');
      return [...prevCart, { food, quantity: 1 }];
    });
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (foodId) => {
    const itemToRemove = cart.find((item) => item.food.id === foodId);
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.food.name} from your cart.`, 'info');
    }
    setCart((prevCart) => prevCart.filter((item) => item.food.id !== foodId));
  };

  // Place Order — calls backend API
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
    const deliveryFee = subtotal > 40 ? 0 : 3.99;
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + deliveryFee + tax;

    // Build items array expected by backend: [{ food: <_id>, quantity }]
    const items = cart.map((item) => ({
      food: item.food.id,
      quantity: item.quantity,
    }));

    try {
      await apiPlaceOrder({ items, totalAmount: parseFloat(finalTotal.toFixed(2)) });
    } catch (err) {
      console.log("Order API error (continuing to success page):", err);
    }

    setCart([]);
    setCurrentPage('order-success');
    showToast('Your gourmet meal order has been submitted successfully!', 'success');
  };

  // User Sign In / Registration Handler — also navigates to correct page
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    showToast(`Welcome back, ${user.name}! Successfully signed in.`, 'success');
    // Navigate here (not in Login.jsx) so currentUser and currentPage
    // update in the same render cycle — avoids the admin guard seeing null
    if (user.role === 'admin') {
      window.history.pushState({}, '', '/admin');
      setCurrentPage('admin-dashboard');
    } else {
      window.history.pushState({}, '', '/dashboard');
      setCurrentPage('dashboard');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCart([]); // Reset Cart
    setCurrentPage('home');
    showToast('You have been securely logged out.', 'info');
  };

  // --- Admin Inventory Controls ---
  const handleAddFood = async (food) => {
    try {
      const res = await apiAddFood({
        name: food.name,
        price: food.price,
        category: food.category,
        description: food.description,
        image: food.image,
      });
      const created = { ...res.data.food, id: res.data.food._id, prepTime: food.prepTime || '15-20 mins', rating: 4.5 };
      setFoods((prev) => [created, ...prev]);
      showToast(`Successfully added ${food.name} to the menu!`, 'success');
    } catch (err) {
      console.log(err);
      showToast('Failed to add food item. Make sure you are logged in as admin.', 'info');
    }
  };

  const handleEditFood = async (updatedFood) => {
    try {
      const res = await apiUpdateFood(updatedFood.id, {
        name: updatedFood.name,
        price: updatedFood.price,
        category: updatedFood.category,
        description: updatedFood.description,
        image: updatedFood.image,
        available: updatedFood.available,
      });
      const updated = { ...res.data.food, id: res.data.food._id, prepTime: updatedFood.prepTime, rating: updatedFood.rating };
      setFoods((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      showToast(`Successfully updated details for ${updatedFood.name}!`, 'success');
    } catch (err) {
      console.log(err);
      showToast('Failed to update food item.', 'info');
    }
  };

  const handleDeleteFood = async (foodId) => {
    const foodToRemove = foods.find((f) => f.id === foodId);
    try {
      await apiDeleteFood(foodId);
      setFoods((prev) => prev.filter((f) => f.id !== foodId));
      if (foodToRemove) {
        showToast(`Removed ${foodToRemove.name} from the menu.`, 'info');
      }
    } catch (err) {
      console.log(err);
      showToast('Failed to delete food item.', 'info');
    }
  };

  // --- Admin Order Queue Controls ---
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await apiUpdateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
      );
      showToast(`Updated Order ${orderId} status to ${status}`, 'success');
    } catch (err) {
      console.log(err);
      showToast('Failed to update order status.', 'info');
    }
  };

  const handleUpdatePaymentStatus = (orderId, status) => {
    // Payment status update is local only (no backend endpoint for it)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    showToast(`Updated Order ${orderId} payment to ${status}`, 'success');
  };

  // Fetch orders from backend when admin is active
  useEffect(() => {
    if (currentUser?.role !== 'admin') return;
    const fetchOrders = async () => {
      try {
        const res = await apiGetOrders();
        // Normalize backend order shape to what AdminDashboard expects
        const normalized = res.data.orders.map((o) => ({
          id: o._id,
          customerName: o.customer?.name || 'Unknown',
          items: o.items
            .map((i) => `${i.food?.name || 'Item'} x${i.quantity}`)
            .join(', '),
          total: o.totalAmount,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          createdAt: new Date(o.createdAt).toISOString().replace('T', ' ').substring(0, 16),
        }));
        setOrders(normalized);
      } catch (err) {
        console.log("Failed to load orders from server, using local data.", err);
      }
    };
    fetchOrders();
  }, [currentUser]);

  // Total cart items count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation page renderer
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            foods={foods}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            id="page-home"
          />
        );
      case 'dashboard':
        return (
          <CustomerDashboard
            foods={foods}
            onAddToCart={handleAddToCart}
            currentUser={currentUser}
            onNavigate={setCurrentPage}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            id="page-customer-dashboard"
          />
        );
      case 'admin-dashboard':
        // Hard guard — if not admin, kick to login
        if (!currentUser || currentUser.role !== 'admin') {
          // Use setTimeout to avoid setState-during-render warning
          setTimeout(() => setCurrentPage('login'), 0);
          return null;
        }
        return (
          <AdminDashboard
            foods={foods}
            orders={orders}
            onAddFood={handleAddFood}
            onEditFood={handleEditFood}
            onDeleteFood={handleDeleteFood}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onLogout={handleLogout}
            currentUser={currentUser}
            id="page-admin-dashboard"
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={setCurrentPage}
            currentUser={currentUser}
            id="page-cart"
          />
        );
      case 'order-success':
        return <OrderSuccess onNavigate={setCurrentPage} id="page-order-success" />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} id="page-login" />;
      case 'register':
        return <Register onRegister={handleLogin} onNavigate={setCurrentPage} id="page-register" />;
      default:
        return (
          <Home
            foods={foods}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentPage}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            id="page-home"
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen" id="app-root-container">
      {/* Dynamic Alert Banner Toast Notification */}
      {notification && (
        <div
          className={`toast-notification ${
            notification.type === 'success' ? 'success' : 'info'
          }`}
          id="toast-alert"
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Persistent App Header Navigation (unless in Admin mode to preserve screen space) */}
      {currentPage !== 'admin-dashboard' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          cartCount={cartCount}
          id="global-navbar"
        />
      )}

      {/* Active Page Viewport Content */}
      <div className="flex-grow" id="app-viewport">
        {renderPage()}
      </div>

      {/* Persistent Footer */}
      {currentPage !== 'admin-dashboard' && <Footer id="global-footer" />}
    </div>
  );
}
