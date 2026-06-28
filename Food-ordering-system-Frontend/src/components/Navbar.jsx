import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User as UserIcon, UtensilsCrossed, LogOut, LayoutGrid } from 'lucide-react';

export default function Navbar({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  cartCount,
  id = 'main-navbar',
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar" id={id}>
      <div className="container nav-container" id={`${id}-container`}>
        {/* Logo */}
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          id={`${id}-logo`}
        >
          <UtensilsCrossed size={28} />
          Food<span>Ordering</span>
        </a>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          id={`${id}-mobile-toggle`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} id={`${id}-nav-element`}>
          <a
            href="#"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            id={`${id}-link-home`}
          >
            Home
          </a>

          {/* If customer, show Customer Dashboard. If Admin, show Admin Dashboard */}
          {currentUser && currentUser.role === 'customer' && (
            <a
              href="#"
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('dashboard');
              }}
              id={`${id}-link-dashboard`}
            >
              Order Foods
            </a>
          )}

          {currentUser && currentUser.role === 'admin' && (
            <a
              href="#"
              className={`nav-link ${currentPage.startsWith('admin') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('admin-dashboard');
              }}
              id={`${id}-link-admin`}
            >
              Admin Dashboard
            </a>
          )}

          <a
            href="#"
            className={`nav-link cart-icon-wrapper ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('cart');
            }}
            id={`${id}-link-cart`}
          >
            <ShoppingCart size={20} />
            <span style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center' }}>Cart</span>
            {cartCount > 0 && <span className="cart-badge" id={`${id}-cart-badge`}>{cartCount}</span>}
          </a>

          {currentUser ? (
            <div className="flex align-center gap-10" style={{ gap: '15px' }} id={`${id}-user-controls`}>
              <span className="flex align-center gap-10" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--secondary)', gap: '6px' }}>
                <UserIcon size={16} />
                Hi, {currentUser.name.split(' ')[0]}
                <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  {currentUser.role}
                </span>
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                id={`${id}-logout-btn`}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex align-center gap-10" style={{ gap: '10px' }} id={`${id}-auth-links`}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleNavClick('login')}
                id={`${id}-login-btn`}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleNavClick('register')}
                id={`${id}-register-btn`}
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
