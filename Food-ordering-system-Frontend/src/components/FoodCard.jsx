import React from 'react';
import { Clock, Star, ShoppingBag } from 'lucide-react';
import Button from './Button';

export default function FoodCard({ food, onAddToCart, id }) {
  const cardId = id || `food-card-${food.id}`;

  return (
    <div className="food-card animate-fade-in" id={cardId}>
      <div className="food-card-img-container" id={`${cardId}-img-wrapper`}>
        <span className="food-card-badge">{food.category}</span>
        <img
          src={food.image}
          alt={food.name}
          className="food-card-img"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="food-card-rating">
          <Star size={14} fill="#f1c40f" stroke="#f1c40f" />
          <span>{food.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="food-card-content">
        <h3 className="food-card-name">{food.name}</h3>
        <p className="food-card-desc">{food.description}</p>
        
        <div className="food-card-meta">
          <span className="flex align-center gap-10" style={{ gap: '6px' }}>
            <Clock size={14} />
            {food.prepTime}
          </span>
          <span>•</span>
          <span style={{ color: food.available ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {food.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="food-card-footer">
          <span className="food-card-price">${food.price.toFixed(2)}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(food)}
            disabled={!food.available}
            id={`${cardId}-add-btn`}
          >
            <ShoppingBag size={14} />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
