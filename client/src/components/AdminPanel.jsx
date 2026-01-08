import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchPendingUsers();
  }, [isAdmin, navigate]);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiClient.get('/auth/pending-users');
      setPendingUsers(response.data.users);
      setError('');
    } catch (error) {
      setError('Failed to fetch pending users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await apiClient.put(`/auth/approve/${userId}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
    } catch (error) {
      setError('Failed to approve user');
      console.error(error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await apiClient.delete(`/auth/reject/${userId}`);
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
    } catch (error) {
      setError('Failed to reject user');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Panel - Pending User Approvals</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Annotator
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {pendingUsers.length === 0 ? (
            <div className="alert alert-info">
              No pending user approvals
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Registered On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleApprove(user._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(user._id)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
