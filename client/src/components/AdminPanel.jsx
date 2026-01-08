import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchAllUsers();
  }, [isAdmin, navigate]);

  useEffect(() => {
    applyFilter();
  }, [filter, allUsers]);

  const fetchAllUsers = async () => {
    try {
      const response = await apiClient.get('/auth/all-users');
      setAllUsers(response.data.users);
      setStats(response.data.stats);
      setError('');
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredUsers(allUsers);
    } else if (filter === 'pending') {
      setFilteredUsers(allUsers.filter(u => !u.isApproved));
    } else if (filter === 'approved') {
      setFilteredUsers(allUsers.filter(u => u.isApproved));
    }
  };

  const handleApprove = async (userId) => {
    try {
      await apiClient.put(`/auth/approve/${userId}`);
      await fetchAllUsers();
      setError('');
    } catch (error) {
      setError('Failed to approve user');
      console.error(error);
    }
  };

  const handleRevoke = async (userId) => {
    try {
      await apiClient.put(`/auth/revoke/${userId}`);
      await fetchAllUsers();
      setError('');
    } catch (error) {
      setError('Failed to revoke user');
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await apiClient.delete(`/auth/delete/${userId}`);
      await fetchAllUsers();
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-0">RSML Speech Annotator - Admin Panel</h4>
            </div>
            <div className="col-auto">
              <button className="btn btn-light btn-sm" onClick={() => navigate('/')}>
                Back to Annotator
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>

      {/* Filter Tabs */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn me-2 ${filter === 'pending' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
      </div>

      {/* Refresh Button */}
      <button
        className="btn btn-success w-100 mb-4 py-3"
        onClick={fetchAllUsers}
      >
        Refresh
      </button>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h2 className="display-4 mb-0">{stats.total}</h2>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h2 className="display-4 mb-0">{stats.active}</h2>
              <p className="text-muted mb-0">Active</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h2 className="display-4 mb-0">{stats.pending}</h2>
              <p className="text-muted mb-0">Waiting Approval</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h2 className="display-4 mb-0">{stats.admins}</h2>
              <p className="text-muted mb-0">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-3">{u.fullName}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        {u.isApproved ? (
                          <span className="badge bg-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex flex-column gap-2" style={{ minWidth: '120px' }}>
                          {!u.isApproved && (
                            <button
                              className="btn btn-success btn-sm w-100"
                              onClick={() => handleApprove(u._id)}
                            >
                              Approve
                            </button>
                          )}
                          {u.isApproved && u.role !== 'admin' && (
                            <button
                              className="btn btn-warning btn-sm w-100"
                              onClick={() => handleRevoke(u._id)}
                            >
                              Revoke
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              className="btn btn-danger btn-sm w-100"
                              onClick={() => handleDelete(u._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminPanel;
