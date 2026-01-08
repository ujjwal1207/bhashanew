# Authentication System

## Overview
The application now has a complete user authentication and authorization system with admin approval workflow.

## Features

### User Registration
- Users can register with:
  - Full Name
  - Email
  - Password (minimum 6 characters)
  - Confirm Password
- After registration, users enter a "pending" state waiting for admin approval

### User Login
- Users login with email and password
- Only approved users can access the application
- JWT token-based authentication
- Token stored in localStorage

### Admin Panel
- Admins can view all pending user registrations
- Approve or reject user requests
- Access via "Admin Panel" button in the header (admin users only)

### Protected Routes
- Main annotator interface requires authentication
- Admin panel requires admin role
- Automatic redirect to login for unauthenticated users

## Default Admin Account

A default admin account has been created:
- **Email**: admin@example.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change this password immediately after first login for security!

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (Requires Authentication)
- `GET /api/auth/me` - Get current user info
- `GET /api/batches` - Get all batches (authentication required)
- `GET /api/batch/:batch/files` - Get files in batch
- `GET /api/batch/:batch/file/:file` - Get segments
- `POST /api/save` - Save RSML annotations

### Admin Only Endpoints
- `GET /api/auth/pending-users` - Get pending user approvals
- `POST /api/auth/approve/:userId` - Approve user
- `POST /api/auth/reject/:userId` - Reject user

## User Flow

1. **New User**:
   - Visit `/register`
   - Fill registration form
   - Wait for admin approval
   - Check email confirmation (future feature)

2. **Admin Approval**:
   - Admin logs in
   - Clicks "Admin Panel"
   - Views pending users
   - Approves or rejects requests

3. **Approved User**:
   - Logs in at `/login`
   - Redirected to main annotator interface
   - Can access all annotation features

4. **Admin User**:
   - Has all user permissions
   - Plus access to Admin Panel
   - Can manage user approvals

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Role-based access control (user/admin)
- Approval workflow for new users

## Environment Variables

Required in `.env`:
```
MONGO_URI=your_mongodb_uri
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
```

## Creating Additional Admin Users

Run the admin creation script:
```bash
node scripts/createAdmin.js
```

Or manually update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin", isApproved: true } }
)
```

## Frontend Routes

- `/login` - Login page
- `/register` - Registration page
- `/` - Main annotator (protected)
- `/admin` - Admin panel (admin only)

## Tech Stack

### Backend
- Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

### Frontend
- React 18
- React Router DOM
- Axios (API calls)
- Bootstrap 5

## Testing the System

1. **Start Backend**:
   ```bash
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Test Registration**:
   - Go to http://localhost:5173/register
   - Register a new user
   - Check MongoDB for pending user

4. **Test Admin Approval**:
   - Login as admin (admin@example.com / admin123)
   - Click "Admin Panel"
   - Approve the pending user

5. **Test User Login**:
   - Logout
   - Login with approved user credentials
   - Access annotator interface

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Activity logging
- [ ] Session management
- [ ] Remember me functionality
- [ ] Multi-factor authentication (MFA)
