import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { registerUser } from '../api/auth';

export default function Register({ onRegister, onNavigate, id = 'register-page' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('All fields are required.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name, email, phone, password });
      const user = res.data.user;

      
      onNavigate('login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in" id={id}>
      <div className="auth-card" id={`${id}-card`}>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today to explore exclusive food deals!</p>
        </div>

        {error && (
          <div className="badge badge-danger flex align-center gap-10" style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', gap: '8px', textTransform: 'none', letterSpacing: 'normal' }} id={`${id}-error`}>
            <UserIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id={`${id}-form`}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <UserIcon size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                id="reg-name"
                className="search-bar-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                id="reg-email"
                className="search-bar-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <Phone size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="tel"
                id="reg-phone"
                className="search-bar-input"
                placeholder="555-123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                id="reg-password"
                className="search-bar-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '10px' }}
            id={`${id}-submit-btn`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('login');
            }}
            id={`${id}-login-link`}
          >
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
}
