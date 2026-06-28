import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { loginUser } from "../api/auth";

export default function Login({ onLogin, onNavigate, id = 'login-page' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await loginUser({ email, password });
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      
      onLogin(user);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setError(msg);
    }
  };

  return (
    <div className="auth-container animate-fade-in" id={id}>
      <div className="auth-card" id={`${id}-card`}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to place orders and manage your favorites</p>
        </div>

        {error && (
          <div
            className="badge badge-danger flex align-center gap-10"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', gap: '8px', textTransform: 'none', letterSpacing: 'normal' }}
            id={`${id}-error`}
          >
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id={`${id}-form`}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                id="login-email"
                className="search-bar-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="search-bar-container" style={{ border: '1px solid var(--border-color)', padding: '2px 10px' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                id="login-password"
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
          >
            Login
            <ArrowRight size={16} />
          </Button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('register'); }}
            id={`${id}-register-link`}
          >
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
}
