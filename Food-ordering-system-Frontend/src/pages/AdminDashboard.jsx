import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { changePassword } from '../api/auth';

export default function AdminDashboard({
  foods,
  orders,
  onAddFood,
  onEditFood,
  onDeleteFood,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onLogout,
  currentUser,
  id = 'admin-dashboard',
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodCategory, setFoodCategory] = useState('Burgers');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodImg, setFoodImg] = useState('');
  const [foodPrep, setFoodPrep] = useState('15-20 mins');
  const [foodAvailable, setFoodAvailable] = useState(true);


  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;

  const totalMeals = foods.length;
  const totalOrders = orders.length;

  
  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFoodName('');
    setFoodPrice('');
    setFoodCategory('Burgers');
    setFoodDesc('');
    setFoodImg('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop');
    setFoodPrep('15-20 mins');
    setFoodAvailable(true);
    setIsFoodModalOpen(true);
  };

  
  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFoodName(food.name);
    setFoodPrice(food.price.toString());
    setFoodCategory(food.category);
    setFoodDesc(food.description);
    setFoodImg(food.image);
    setFoodPrep(food.prepTime);
    setFoodAvailable(food.available);
    setIsFoodModalOpen(true);
  };

  
  const handleFoodSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !foodPrice || !foodDesc) {
      alert('Please fill in Name, Price, and Description.');
      return;
    }

    const priceNum = parseFloat(foodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid positive price.');
      return;
    }

    if (editingFood) {
      
      const updated = {
        ...editingFood,
        name: foodName,
        price: priceNum,
        category: foodCategory,
        description: foodDesc,
        image: foodImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
        prepTime: foodPrep,
        available: foodAvailable,
      };
      onEditFood(updated);
    } else {
      
      const created = {
        id: `food-${Date.now()}`,
        name: foodName,
        price: priceNum,
        category: foodCategory,
        description: foodDesc,
        image: foodImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
        prepTime: foodPrep,
        available: foodAvailable,
        rating: 5.0, 
      };
      onAddFood(created);
    }

    setIsFoodModalOpen(false);
  };

  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setPwSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="admin-layout" id={id}>
      {/* Admin Sidebar Section */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        id={`${id}-sidebar`}
      />

      {/* Main Panel */}
      <main className="admin-main" id={`${id}-main-content`}>
        {/* TAB 1: Summary Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" id={`${id}-tab-dashboard`}>
            <div className="admin-header-bar">
              <h2>Dashboard Summary</h2>
              <span className="badge badge-info" style={{ textTransform: 'none', padding: '6px 14px', fontSize: '0.85rem' }}>
                System Online
              </span>
            </div>

            {/* Stat Cards Grid */}
            <div className="stats-grid" id={`${id}-stats-grid`}>
              <div className="stat-card" id={`${id}-stat-revenue`}>
                <div className="stat-info">
                  <h4>Total Revenue</h4>
                  <p>${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="stat-icon success">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="stat-card" id={`${id}-stat-active`}>
                <div className="stat-info">
                  <h4>Active Orders</h4>
                  <p>{activeOrdersCount}</p>
                </div>
                <div className="stat-icon warning">
                  <ClipboardList size={24} />
                </div>
              </div>

              <div className="stat-card" id={`${id}-stat-meals`}>
                <div className="stat-info">
                  <h4>Menu Inventory</h4>
                  <p>{totalMeals} Items</p>
                </div>
                <div className="stat-icon primary">
                  <Utensils size={24} />
                </div>
              </div>

              <div className="stat-card" id={`${id}-stat-total`}>
                <div className="stat-info">
                  <h4>All-Time Orders</h4>
                  <p>{totalOrders}</p>
                </div>
                <div className="stat-icon info">
                  <ShoppingBag size={24} />
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="table-responsive" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '20px' }}>
                Recent Deliveries
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Subtotal</th>
                    <th>Status</th>
                    <th>Placed At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.orderStatus === 'Delivered'
                              ? 'badge-success'
                              : order.orderStatus === 'Cancelled'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Manage Foods Page */}
        {activeTab === 'foods' && (
          <div className="animate-fade-in" id={`${id}-tab-foods`}>
            <div className="admin-header-bar">
              <h2>Manage Food Inventory</h2>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddModal}
                id={`${id}-add-food-btn`}
              >
                <Plus size={16} />
                Add Food Item
              </Button>
            </div>

            <div className="table-responsive" id={`${id}-foods-table-wrapper`}>
              <table>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Meal Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Prep Time</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id} id={`${id}-food-row-${food.id}`}>
                      <td>
                        <img src={food.image} alt={food.name} className="table-food-img" />
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{food.name}</td>
                      <td>
                        <span className="badge badge-info" style={{ textTransform: 'none' }}>
                          {food.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${food.price.toFixed(2)}</td>
                      <td>{food.prepTime}</td>
                      <td>
                        <span className={`badge ${food.available ? 'badge-success' : 'badge-danger'}`}>
                          {food.available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          <button
                            type="button"
                            className="btn-icon btn-icon-edit"
                            onClick={() => handleOpenEditModal(food)}
                            title="Edit meal details"
                            id={`${id}-edit-${food.id}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${food.name}" from the menu?`)) {
                                onDeleteFood(food.id);
                              }
                            }}
                            title="Delete meal"
                            id={`${id}-delete-${food.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Orders Page */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in" id={`${id}-tab-orders`}>
            <div className="admin-header-bar">
              <h2>Incoming Orders Queue</h2>
              <span className="badge badge-warning" style={{ textTransform: 'none', padding: '6px 14px', fontSize: '0.85rem' }}>
                {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length} Active Orders
              </span>
            </div>

            <div className="table-responsive" id={`${id}-orders-table-wrapper`}>
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Ordered Meal Items</th>
                    <th>Total Price</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Update Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} id={`${id}-order-row-${order.id}`}>
                      {/* Customer Name */}
                      <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{order.customerName}</td>
                      
                      {/* Food Items list */}
                      <td style={{ fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                        {order.items}
                      </td>
                      
                      {/* Total */}
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${order.total.toFixed(2)}</td>
                      
                      {/* Payment Status with interactive toggler */}
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', width: '110px', height: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                          value={order.paymentStatus}
                          onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value)}
                          id={`${id}-pay-${order.id}`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      
                      {/* Order Status Badge */}
                      <td>
                        <span
                          className={`badge ${
                            order.orderStatus === 'Placed'
                              ? 'badge-info'
                              : order.orderStatus === 'Processing'
                              ? 'badge-warning'
                              : order.orderStatus === 'Delivered'
                              ? 'badge-success'
                              : 'badge-danger'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      
                      {/* Update Status Actions */}
                      <td>
                        <div className="flex gap-10" style={{ gap: '6px' }}>
                          <select
                            className="form-control"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', width: '130px', height: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                            value={order.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                            id={`${id}-status-${order.id}`}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB 4: Settings — Change Password */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in" id={`${id}-tab-settings`}>
            <div className="admin-header-bar">
              <h2>Account Settings</h2>
            </div>

            <div style={{ maxWidth: '480px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)' }}>Change Password</h3>
              </div>

              {pwError && (
                <div style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', color: '#c53030', fontSize: '0.875rem' }}>
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div style={{ backgroundColor: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', color: '#276749', fontSize: '0.875rem' }}>
                  {pwSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword} id={`${id}-change-pw-form`}>
                {/* Old Password */}
                <div className="form-group">
                  <label htmlFor="old-password">Current Password</label>
                  <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
                    <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showOld ? 'text' : 'password'}
                      id="old-password"
                      className="search-bar-input"
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowOld(!showOld)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px' }}>
                      {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
                    <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showNew ? 'text' : 'password'}
                      id="new-password"
                      className="search-bar-input"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px' }}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
                    <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="confirm-password"
                      className="search-bar-input"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px' }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  style={{ width: '100%', marginTop: '8px' }}
                  disabled={pwLoading}
                  id={`${id}-change-pw-btn`}
                >
                  {pwLoading ? 'Saving...' : 'Update Password'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Reusable Modal for Adding / Editing food */}
      <Modal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        title={editingFood ? 'Edit Food Item Details' : 'Add New Food to Menu'}
        id="admin-food-modal"
      >
        <form onSubmit={handleFoodSubmit} id={`${id}-modal-form`}>
          <div className="form-group">
            <label htmlFor="modal-food-name">Food Title *</label>
            <input
              type="text"
              id="modal-food-name"
              className="form-control"
              placeholder="e.g. Cheese Crust Special"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '15px', marginBottom: '0px' }}>
            <div className="form-group">
              <label htmlFor="modal-food-price">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                id="modal-food-price"
                className="form-control"
                placeholder="12.99"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-food-category">Category *</label>
              <select
                id="modal-food-category"
                className="form-control"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
              >
                <option value="Burgers">Burgers</option>
                <option value="Pizza">Pizza</option>
                <option value="Sushi">Sushi</option>
                <option value="Desserts">Desserts</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '15px', marginBottom: '0px' }}>
            <div className="form-group">
              <label htmlFor="modal-food-prep">Prep Time</label>
              <input
                type="text"
                id="modal-food-prep"
                className="form-control"
                placeholder="e.g. 15-20 mins"
                value={foodPrep}
                onChange={(e) => setFoodPrep(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-food-available">Availability Status</label>
              <select
                id="modal-food-available"
                className="form-control"
                value={foodAvailable ? 'true' : 'false'}
                onChange={(e) => setFoodAvailable(e.target.value === 'true')}
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal-food-img">Image Stock URL</label>
            <input
              type="url"
              id="modal-food-img"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={foodImg}
              onChange={(e) => setFoodImg(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-food-desc">Description *</label>
            <textarea
              id="modal-food-desc"
              className="form-control"
              style={{ minHeight: '80px', resize: 'vertical' }}
              placeholder="Provide a culinary description..."
              value={foodDesc}
              onChange={(e) => setFoodDesc(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFoodModalOpen(false)}
              id={`${id}-modal-cancel`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              id={`${id}-modal-submit`}
            >
              {editingFood ? 'Save Modifications' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
