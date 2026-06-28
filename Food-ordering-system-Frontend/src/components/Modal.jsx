import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, id = 'modal' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id={`${id}-overlay`}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        id={`${id}-container`}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            id={`${id}-close-btn`}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body" id={`${id}-body`}>
          {children}
        </div>
      </div>
    </div>
  );
}
