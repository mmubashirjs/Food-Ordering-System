import React from 'react';
import { UtensilsCrossed, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ id = 'main-footer' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id={id}>
      <div className="container" id={`${id}-container`}>
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-col" id={`${id}-col-about`}>
            <h3>
              <UtensilsCrossed size={20} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Food<span>Ordering</span>
            </h3>
            <p style={{ marginTop: '15px' }}>
              We bring delicious meals from your favorite local kitchens straight to your doorstep. Satisfy your cravings with fresh, fast, and secure food delivery. Made for premium dining and seamless delivery.
            </p>
          </div>

          {/* Useful Links Column */}
          <div className="footer-col" id={`${id}-col-links`}>
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#menu">Our Menu</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col" id={`${id}-col-contact`}>
            <h3>Contact Us</h3>
            <ul className="footer-links" style={{ pointerEvents: 'none' }}>
              <li className="flex align-center gap-10" style={{ gap: '8px', color: '#bdc3c7', fontSize: '0.95rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                123 Gourmet Street, Foodville
              </li>
              <li className="flex align-center gap-10" style={{ gap: '8px', color: '#bdc3c7', fontSize: '0.95rem' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                +1 (555) 987-6543
              </li>
              <li className="flex align-center gap-10" style={{ gap: '8px', color: '#bdc3c7', fontSize: '0.95rem' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                support@foodordering.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" id={`${id}-bottom`}>
          <p>&copy; {currentYear} Food Ordering System. All rights reserved. Designed for excellence in dining.</p>
        </div>
      </div>
    </footer>
  );
}
