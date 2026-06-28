import React from 'react';
import { ChefHat, Flame, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { CATEGORIES_WITH_EMOJIS } from '../data';
import Button from '../components/Button';

export default function Home({
  foods,
  onAddToCart,
  onNavigate,
  selectedCategory,
  setSelectedCategory,
  id = 'home-page',
}) {
  
 const filteredFoods = selectedCategory === 'All'
  ? foods
  : foods.filter((f) => f.category === selectedCategory);

  return (
    <div id={id} className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" id={`${id}-hero`}>
        <div className="container hero-content">
          <span className="hero-subtitle">Satisfy Your Cravings</span>
          <h1 className="hero-title">
            Delicious Meals Delivered <span>Fast & Fresh</span>
          </h1>
          <p className="hero-desc">
            Explore a premium selection of gourmet burgers, hand-stretched artisan pizza, freshly prepared sushi, and decadent desserts. Designed with love, served with care.
          </p>
          <div className="hero-cta">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('dashboard')}
              id={`${id}-hero-order-btn`}
            >
              Order Now
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Badges section (Why Choose Us) */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '30px' }}>
            Why Food Ordering System?
          </div>
          <div className="grid-4" style={{ marginTop: '20px' }}>
            <div className="stat-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '30px' }}>
              <div className="stat-icon primary" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px auto' }}>
                <ChefHat size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>Master Chefs</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prepared by Michelin star chefs with the freshest premium ingredients.</p>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '30px' }}>
              <div className="stat-icon success" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px auto' }}>
                <Flame size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>Served Piping Hot</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Special heat-retaining delivery boxes guarantee hot meals upon delivery.</p>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '30px' }}>
              <div className="stat-icon info" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px auto' }}>
                <Truck size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>Super Fast Logistics</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>A dedicated fleet of dispatch riders secures delivery within 30 minutes.</p>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', textAlign: 'center', padding: '30px' }}>
              <div className="stat-icon warning" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px auto' }}>
                <ShieldCheck size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>Quality Assured</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Strictest hygiene levels and organic food certifications across all stores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Recommended Foods Section */}
      <section style={{ backgroundColor: 'var(--bg-color)' }} id={`${id}-recommendations`}>
        <div className="container">
          <h2 className="section-title">Explore Our Popular Menu</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '600px', margin: '-30px auto 40px auto', fontSize: '0.95rem' }}>
            Filter by your favorite categories and add mouth-watering foods to your cart with a single click.
          </p>

          {/* Categories Selector */}
          <div className="category-filter" id={`${id}-categories`}>
            {CATEGORIES_WITH_EMOJIS.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
                id={`${id}-cat-btn-${cat.name.toLowerCase()}`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Foods Grid */}
          {filteredFoods.length > 0 ? (
            <div className="grid-4" id={`${id}-foods-grid`}>
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onAddToCart={onAddToCart}
                  id={`${id}-food-${food.id}`}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No food items available in this category yet.
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('dashboard')}
              id={`${id}-view-all-btn`}
            >
              View Full Menu
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
