import React, { useState, useMemo } from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import { CATEGORIES_WITH_EMOJIS } from '../data';
import Button from '../components/Button';

export default function CustomerDashboard({
  foods,
  onAddToCart,
  currentUser,
  onNavigate,
  selectedCategory,
  setSelectedCategory,
  id = 'customer-dashboard',
}) {
  const [searchQuery, setSearchQuery] = useState('');

  
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            food.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  return (
    <div className="container dashboard-layout animate-fade-in" id={id}>
      {/* Header Area */}
      <div className="dashboard-header-bar" id={`${id}-header-bar`}>
        <div>
          <h2 className="dashboard-welcome" id={`${id}-welcome`}>
            What would you like to eat today, <span>{currentUser?.name || 'Guest'}</span>?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Discover freshly-made food from local professional kitchens.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('cart')}
          id={`${id}-go-cart-btn`}
        >
          View Cart
          <ArrowRight size={14} />
        </Button>
      </div>

      {/* Search and Category Tag Filters */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '35px' }} id={`${id}-filter-container`}>
        <div style={{ marginBottom: '20px', maxWidth: '600px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>
            Search Menu Items
          </label>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by burger, pizza, matcha, sweet..."
            id={`${id}-search`}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '12px' }}>
            Browse Categories
          </label>
          <div className="category-filter" style={{ justifyContent: 'flex-start', marginBottom: 0 }} id={`${id}-categories`}>
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
        </div>
      </div>

      {/* Food Cards Grid */}
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
        <div className="cart-empty-state" style={{ margin: '40px auto', maxWidth: '500px' }} id={`${id}-no-results`}>
          <div className="success-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Sparkles size={28} />
          </div>
          <h3>No Foods Found</h3>
          <p>We couldn't find any meals matching your current filters. Try searching for something else or changing categories.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            id={`${id}-reset-filter-btn`}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
