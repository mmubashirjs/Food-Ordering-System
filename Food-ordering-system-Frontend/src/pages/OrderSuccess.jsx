import React from 'react';
import { CheckCircle2, ShoppingBag, Clock } from 'lucide-react';
import Button from '../components/Button';

export default function OrderSuccess({ onNavigate, id = 'order-success-page' }) {
  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} id={id}>
      <div className="success-card" id={`${id}-card`}>
        <div className="success-icon-wrapper" id={`${id}-icon`}>
          <CheckCircle2 size={40} />
        </div>

        <h2>Order Placed Successfully!</h2>
        <p>
          Thank you for ordering with us! Your kitchen has accepted the order and is preparing it. Your delicious hot meal will arrive at your location in approximately <strong>25 - 35 minutes</strong>.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }} id={`${id}-actions`}>
          <Button
            variant="primary"
            onClick={() => onNavigate('dashboard')}
            id={`${id}-menu-btn`}
          >
            <ShoppingBag size={16} />
            Explore Menu Again
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            id={`${id}-home-btn`}
          >
            Back Home
          </Button>
        </div>

        <div className="flex align-center gap-10" style={{ gap: '6px', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '30px' }}>
          <Clock size={14} />
          <span>Real-time delivery tracing can be updated in the Admin Dashboard!</span>
        </div>
      </div>
    </div>
  );
}
