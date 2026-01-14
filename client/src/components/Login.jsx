import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 auth-container">
      

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center py-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="auth-card" style={{ padding: '2rem' }}>
                <div className="text-center mb-3">
                  <div className="auth-icon mb-2" style={{ fontSize: '3rem' }}>
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <h3 className="fw-bold mb-1">Welcome Back</h3>
                  <p className="text-muted small mb-0">Sign in to continue to Shoonya</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger rounded-pill" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      className="form-control modern-input"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold mb-1">Password</label>
                    <input
                      type="password"
                      className="form-control modern-input"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary modern-btn w-100 py-2 mb-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                    ) : (
                      <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3 pt-2 border-top">
                  <p className="mb-0 text-muted small">
                    Don't have an account? <Link to="/register" className="fw-semibold text-decoration-none">Create Account</Link>
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

export default Login;
