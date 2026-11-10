import React, { useState } from 'react';
import { Cpu, Shield, Brain, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); 
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-info">
          {/* Centered logo wrapper */}
          <div className="login-logo-wrapper">
            <img 
              src="/logo.png" 
              alt="OfferLens AI Logo" 
              className="custom-login-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <h1>OFFERLENS AI</h1>
          <h2>Digital Fraud Intelligence &amp; Verification</h2>
          <p>Advanced AI-powered platform for autonomous threat detection, real-time analytics, and intelligent security systems.</p>
          
          <div className="login-features">
            <div className="feature-box">
              <Cpu size={24} className="feature-icon" />
              <span>AI-Powered</span>
            </div>
            <div className="feature-box">
              <Shield size={24} className="feature-icon" color="#a855f7" />
              <span>Secure</span>
            </div>
            <div className="feature-box">
              <Brain size={24} className="feature-icon" color="#ec4899" />
              <span>Smart Analysis</span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <h3>Welcome Back</h3>
          <p className="login-subtext">Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input type="email" placeholder="admin@offerlens.ai" required defaultValue="admin@offerlens.ai" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  defaultValue="••••••••"
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-pwd">Forgot password?</a>
            </div>

            <button type="submit" className="sign-in-btn">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="login-footer">
            Don't have an account? <a href="#">Contact Administrator</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;