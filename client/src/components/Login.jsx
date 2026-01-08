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
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container">
          <h4 className="mb-0">RSML Speech Annotator</h4>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <div className="col-md-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="text-center mb-4">Login</h2>
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <p className="mb-0">
                      Don't have an account? <Link to="/register">Register</Link>
                    </p>
                  </div>
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
