import React, { useState, useEffect, useRef } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usecrmPageTitle';
import axios from 'axios';
import config from '../../config';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const FloatingInput = ({ label, type, value, onChange, name, showToggle, onToggle, isVisible }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        const currentValue = inputRef.current.value;
        if (currentValue && currentValue !== value) {
          onChange({ target: { value: currentValue } });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [onChange, value]);

  return (
    <div className="input-group" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        autoComplete="on"
        className={value ? 'has-value' : ''}
      />
      <label>{label}</label>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="password-toggle-btn"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
        </button>
      )}
    </div>
  );
};

const Login = () => {
  usePageTitle();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/token/`, {
        email,
        password,
      });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('tenantId', response.data.tenant_id);
      localStorage.setItem('tenantSchema', response.data.tenant_schema);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      window.location.href = `${config.API_BASE_URL}/accounts/google/login/?next=/api/users/social/callback/`;
    } catch (error) {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', error);
    }
  };

  const handleAppleLogin = () => {
    try {
      window.location.href = `${config.API_BASE_URL}/accounts/apple/login/?next=/api/users/social/callback/`;
    } catch (error) {
      setError('Apple login failed. Please try again.');
      console.error('Apple login error:', error);
    }
  };

  const handleMicrosoftLogin = () => {
    try {
      window.location.href = `${config.API_BASE_URL}/accounts/microsoft/login/?next=/api/users/social/callback/`;
    } catch (error) {
      setError('Microsoft login failed. Please try again.');
      console.error('Microsoft login error:', error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="login-container">
      <form className="login-form Gen-Boxshadow" onSubmit={handleSubmit} autoComplete="on">
        <h2 className="form-title">Login to continue</h2>

        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

        <FloatingInput
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FloatingInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle={true}
          onToggle={togglePasswordVisibility}
          isVisible={showPassword}
        />

        <div className='fffl-paus'>
          <Link to='/forgot-password'>Forgot password?</Link>
        </div>

        <button className="login-btn btn-primary-bg" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Continue'}
        </button>

        <div className='FFlaok-paus'>
          <p>Don't have an account? <Link to='/register'>Create account</Link></p>
        </div>

        <div className="social-login">
          <p className="login-divider"><span>or</span></p>

          <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError('Google login failed. Please try again.');
                console.log('Google Login Failed');
              }}
              render={(renderProps) => (
                <button
                  className="social-btn google"
                  type="button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <span className="icon ggole-Pol">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  </span>
                  Continue with Google
                </button>
              )}
            />
          </GoogleOAuthProvider>

          <button className="social-btn apple" type="button" onClick={handleAppleLogin}>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="#000">
                <path d="M16.365 1.43c0 1.14-.49 2.18-1.3 2.9-.81.72-1.9 1.14-3.01 1.05a3.4 3.4 0 0 1-.03-.52c0-1.11.49-2.19 1.3-2.91.81-.72 1.9-1.14 3.01-1.05.01.18.02.36.02.53zm3.35 17.6c-.4.92-.88 1.79-1.44 2.6-.76 1.08-1.38 1.83-1.94 2.24-.55.4-1.13.61-1.75.61-.45 0-1.01-.13-1.68-.38-.66-.25-1.27-.38-1.83-.38-.59 0-1.23.13-1.91.38-.68.25-1.2.38-1.56.38-.64 0-1.24-.2-1.8-.61-.56-.41-1.22-1.16-1.98-2.24-.61-.87-1.13-1.8-1.56-2.8-.49-1.15-.74-2.27-.74-3.37 0-1.24.29-2.31.87-3.22.58-.91 1.34-1.63 2.28-2.16.95-.53 1.98-.79 3.09-.79.6 0 1.38.16 2.35.48.96.32 1.58.48 1.85.48.2 0 .85-.20 1.94-.59 1.03-.36 1.9-.51 2.62-.46.78.07 1.45.23 2 .5a5.8 5.8 0 0 1 1.55 1.18c-.62.68-1.24 1.36-1.86 2.05-.8.84-1.2 1.77-1.2 2.8 0 .8.2 1.57.6 2.3.4.73.87 1.29 1.4 1.67z" />
              </svg>
            </span>
            Continue with Apple
          </button>

          <button className="social-btn microsoft" type="button" onClick={handleMicrosoftLogin}>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="#fff">
                <path d="M0 0h11v11H0z" fill="#f25022" />
                <path d="M13 0h11v11H13z" fill="#7fba00" />
                <path d="M0 13h11v11H0z" fill="#00a4ef" />
                <path d="M13 13h11v11H13z" fill="#ffb900" />
              </svg>
            </span>
            Continue with Microsoft
          </button>
        </div>

        <div className='Reg-Foot'>
          <Link to='/terms'>Terms of Use</Link>
          <Link to='/privacy-policy'>Permissions</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;