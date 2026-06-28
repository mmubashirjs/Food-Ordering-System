import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onNavigate,
  currentUser,
  id = 'cart-page',
}) {
  const [isPlacing, setIsPlacing] = useState(false);

  
  const subtotal = cart.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
  const deliveryFee = subtotal > 40 ? 0 : 3.99; 
  const tax = subtotal * 0.08; 
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    setIsPlacing(true);


    setTimeout(() => {
      setIsPlacing(false);
      onPlaceOrder();
    }, 1500);
  };

  if (isPlacing) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} id={`${id}-placing-loader`}>
        <Loader text="Securing connection and transmitting your order details..." />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container cart-layout animate-fade-in" id={id}>
        <div className="cart-empty-state" id={`${id}-empty-state`}>
          <div className="success-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ShoppingCart size={32} />
          </div>
          <h3>Your Food Cart is Empty</h3>
          <p>You haven't added any meals yet. Head back to the dashboard to select some delicious meals.</p>
          <Button
            variant="primary"
            onClick={() => onNavigate('dashboard')}
            id={`${id}-empty-back-btn`}
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-layout animate-fade-in" id={id}>
      <div style={{ marginBottom: '30px' }}>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="btn btn-outline btn-sm"
          style={{ paddingLeft: '8px' }}
          id={`${id}-back-btn`}
        >
          <ChevronLeft size={16} />
          Continue Selection
        </button>
      </div>

      <div className="cart-grid" id={`${id}-grid`}>
        {/* Cart items list */}
        <div className="cart-items-panel" id={`${id}-items-panel`}>
          <h3 className="summary-title" style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
            My Basket ({cart.length} meal{cart.length > 1 ? 's' : ''})
          </h3>

          {cart.map((item) => (
            <div className="cart-item-row" key={item.food.id} id={`${id}-item-${item.food.id}`}>
              <div className="cart-item-info">
                <img src={item.food.image} alt={item.food.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.food.name}</h4>
                  <p>{item.food.category} • {item.food.prepTime}</p>
                </div>
              </div>

              <div className="flex align-center" style={{ gap: '20px' }}>
                <div className="qty-control" id={`${id}-item-${item.food.id}-qty`}>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.food.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    id={`${id}-item-${item.food.id}-minus`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.food.id, item.quantity + 1)}
                    id={`${id}-item-${item.food.id}-plus`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="cart-item-price-col">${(item.food.price * item.quantity).toFixed(2)}</span>

                <button
                  type="button"
                  className="btn-icon btn-icon-delete"
                  onClick={() => onRemoveItem(item.food.id)}
                  title="Remove from cart"
                  id={`${id}-item-${item.food.id}-delete`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        
        <div className="cart-summary-panel" id={`${id}-summary-panel`}>
          <h3 className="summary-title">Summary of Order</h3>

          <div className="summary-row" id={`${id}-row-subtotal`}>
            <span style={{ color: 'var(--text-muted)' }}>Basket Subtotal</span>
            <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row" id={`${id}-row-delivery`}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery</span>
            <span style={{ fontWeight: 500, color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
            </span>
          </div>

          <div className="summary-row" id={`${id}-row-tax`}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
            <span style={{ fontWeight: 500 }}>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total" id={`${id}-row-total`}>
            <span>Order Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {!currentUser && (
            <div style={{ backgroundColor: '#fff9e7', border: '1px solid #f39c12', borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: '0.8rem', color: '#b7791f', margin: '20px 0 10px 0' }} id={`${id}-login-warning`}>
              🚨 Please <strong>Login</strong> or register a test account below to submit your order. We've saved your meals in your basket!
            </div>
          )}

          <Button
            variant="primary"
            style={{ width: '100%', marginTop: '20px', padding: '14px 20px' }}
            onClick={handleCheckout}
            id={`${id}-checkout-btn`}
          >
            <ShoppingBag size={18} />
            {currentUser ? 'Place Order Now' : 'Login to Complete Order'}
          </Button>

          {deliveryFee > 0 && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              Add <strong>${(40 - subtotal).toFixed(2)}</strong> more in meals to secure <strong>FREE delivery</strong>!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
