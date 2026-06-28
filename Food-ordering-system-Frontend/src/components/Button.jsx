import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  id,
  type = 'button',
  onClick,
  disabled,
  style,
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const combinedClass = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      id={id || `btn-${Math.random().toString(36).substr(2, 9)}`}
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
