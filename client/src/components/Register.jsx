import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      setSuccess(result.message || 'Registration successful! Waiting for admin approval.');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 auth-container">
      {/* Header */}
      <header className="modern-header">
        <div className="container py-4">
          <div className="d-flex align-items-center gap-3">
            <div className="header-icon">
              <i className="bi bi-mic-fill"></i>
            </div>
            <h3 className="mb-0 fw-bold">Shoonya</h3>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="auth-card">
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join Shoonya annotation platform</p>
                </div>
                  
                  {error && (
                    <div className="alert alert-danger rounded-pill" role="alert">
                      <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success rounded-pill" role="alert">
                      <i className="bi bi-check-circle me-2"></i>{success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control modern-input"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className="form-control modern-input"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                      <small className="text-muted"><i className="bi bi-info-circle me-1"></i>Minimum 6 characters</small>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control modern-input"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary modern-btn w-100 py-3 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                      ) : (
                        <><i className="bi bi-person-check me-2"></i>Create Account</>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="mb-0 text-muted">
                      Already have an account? <Link to="/login" className="fw-semibold text-decoration-none">Sign In</Link>
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
