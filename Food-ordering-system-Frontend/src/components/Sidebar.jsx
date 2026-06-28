import React from 'react';
import { LayoutDashboard, Utensils, ClipboardList, LogOut, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, onLogout, id = 'admin-sidebar' }) {
  return (
    <aside className="sidebar" id={id}>
      <div className="sidebar-logo-area">
        <h3 className="sidebar-title">Admin Controls</h3>
      </div>
      <nav className="sidebar-menu">
        <button
          type="button"
          className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
          id={`${id}-menu-dashboard`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`sidebar-item ${activeTab === 'foods' ? 'active' : ''}`}
          onClick={() => onTabChange('foods')}
          id={`${id}-menu-foods`}
        >
          <Utensils size={18} />
          <span>Manage Foods</span>
        </button>

        <button
          type="button"
          className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => onTabChange('orders')}
          id={`${id}-menu-orders`}
        >
          <ClipboardList size={18} />
          <span>Orders</span>
        </button>

        <button
          type="button"
          className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange('settings')}
          id={`${id}-menu-settings`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-logout">
        <button
          type="button"
          className="sidebar-item"
          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}
          onClick={onLogout}
          id={`${id}-menu-logout`}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
