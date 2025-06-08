import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FloatingInput = ({ label, type, value, onChange, name }) => {
  return (
    <div className="input-group" style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        autoComplete="email"
        className={value ? 'has-value' : ''}
      />
      <label>{label}</label>
    </div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot password email:', email);
    // Trigger sending reset code here
  };

  return (
    <div className="login-container">
      <form className="login-form Gen-Boxshadow" onSubmit={handleSubmit} autoComplete="on">
        <h2 className="form-title">Forgot Password?</h2>

        <FloatingInput
          label="Enter your email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-btn btn-primary-bg" type="submit">
          Send Reset Code
        </button>

             <div className="FFlaok-paus">
          <p>
            Didn't receive a code? <button>Resend code</button>
          </p>
        </div>

        <div className="FFlaok-paus">
          <p>
            <Link to="/login">Login insted!</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
