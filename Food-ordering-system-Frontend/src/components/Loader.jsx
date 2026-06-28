import React from 'react';

export default function Loader({ text = 'Preparing delicious food...', id }) {
  return (
    <div className="loader-wrapper" id={id || "loader-spinner-wrapper"}>
      <div className="loader-spinner" id={id ? `${id}-spinner` : "main-loader-spinner"}></div>
      <p className="loader-text">{text}</p>
    </div>
  );
}
