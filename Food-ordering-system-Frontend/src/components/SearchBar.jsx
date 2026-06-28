import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search delicious foods...',
  id = 'search-bar-input',
}) {
  return (
    <div className="search-bar-container" id={`${id}-container`}>
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        id={id}
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="qty-btn"
          style={{ width: '30px', height: '30px' }}
          title="Clear search"
          id={`${id}-clear`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
