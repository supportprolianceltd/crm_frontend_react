import React, { useState, useRef, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';


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
        autoComplete="new-password"
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
          {isVisible ? (
            <EyeSlashIcon className="icon" />
          ) : (
            <EyeIcon className="icon" />
          )}
        </button>
      )}
    </div>
  );
};

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('New password submitted:', password);
    // Add your password reset logic here
  };

  return (
    <div className="login-container">
      <form className="login-form Gen-Boxshadow" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="form-title">Set New Password</h2>

        <FloatingInput
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle={true}
          onToggle={() => setShowPassword((prev) => !prev)}
          isVisible={showPassword}
        />

        <FloatingInput
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showToggle={true}
          onToggle={() => setShowConfirmPassword((prev) => !prev)}
          isVisible={showConfirmPassword}
        />

        <button className="login-btn btn-primary-bg" type="submit">
          Reset Password
        </button>

        <div className="FFlaok-paus" style={{ marginTop: '1rem' }}>
          <p>
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default NewPassword;
