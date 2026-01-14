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
    <div className="d-flex flex-column min-vh-100 admin-panel">
      {/* Header */}
      <header className="modern-header border-bottom">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-3">
                <div className="header-icon">
                  <i className="bi bi-shield-fill-check"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">Admin Dashboard</h3>
                  <small className="text-muted">Manage users and permissions</small>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/')}>
                Back to Annotator
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="stat-content">
              <h2 className="stat-number">{stats.total}</h2>
              <p className="stat-label">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <i className="bi bi-person-check-fill"></i>
            </div>
            <div className="stat-content">
              <h2 className="stat-number">{stats.active}</h2>
              <p className="stat-label">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <i className="bi bi-clock-fill"></i>
            </div>
            <div className="stat-content">
              <h2 className="stat-number">{stats.pending}</h2>
              <p className="stat-label">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card stat-card-info">
            <div className="stat-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <div className="stat-content">
              <h2 className="stat-number">{stats.admins}</h2>
              <p className="stat-label">Administrators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Refresh */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <button
            className={`btn rounded-pill px-4 py-2 ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            <i className="bi bi-list-ul me-2"></i>All Users
          </button>
          <button
            className={`btn rounded-pill px-4 py-2 ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('pending')}
          >
            <i className="bi bi-hourglass-split me-2"></i>Pending
          </button>
          <button
            className={`btn rounded-pill px-4 py-2 ${filter === 'approved' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('approved')}
          >
            <i className="bi bi-check-circle me-2"></i>Approved
          </button>
        </div>
        <button
          className="btn btn-success rounded-pill px-4 py-2"
          onClick={fetchAllUsers}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="card border-0 shadow-sm modern-table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 modern-table">
              <thead>
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Registered</th>
                  <th className="px-4 py-4">Actions</th>
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
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <span className="fw-semibold">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted">{u.email}</td>
                      <td className="px-4 py-4">
                        <span className="badge rounded-pill bg-primary px-3 py-2">{u.role}</span>
                      </td>
                      <td className="px-4 py-4">
                        {u.isApproved ? (
                          <span className="badge rounded-pill bg-success px-3 py-2">
                            <i className="bi bi-check-circle me-1"></i>Approved
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
                            <i className="bi bi-hourglass-split me-1"></i>Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex gap-3" style={{ minWidth: '200px' }}>
                          {!u.isApproved && (
                            <button
                              className="btn btn-success btn-sm rounded-pill px-4"
                              onClick={() => handleApprove(u._id)}
                            >
                              <i className="bi bi-check-lg me-1"></i>Approve
                            </button>
                          )}
                          {u.isApproved && u.role !== 'admin' && (
                            <button
                              className="btn btn-warning btn-sm rounded-pill px-4"
                              onClick={() => handleRevoke(u._id)}
                            >
                              <i className="bi bi-x-lg me-1"></i>Revoke
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              className="btn btn-danger btn-sm rounded-pill px-4"
                              onClick={() => handleDelete(u._id)}
                            >
                              <i className="bi bi-trash me-1"></i>Delete
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
    </div>
  );
};

export default AdminPanel;
