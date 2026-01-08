# Quick Start Guide - Authentication System

## System is Ready! 🎉

The authentication system has been successfully integrated into your RSML Speech Annotator application.

## What's New

✅ User registration with admin approval
✅ Secure login with JWT tokens
✅ Role-based access control (User/Admin)
✅ Protected routes
✅ Admin panel for user management

## Access the Application

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:3001

## Quick Test Steps

### Step 1: Test Admin Login
1. Go to http://localhost:5173
2. You'll be redirected to `/login`
3. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
4. You should see the main annotator interface
5. Notice "Admin Panel" button in the header

### Step 2: Test User Registration
1. Logout (click Logout button)
2. Click "Register" link
3. Fill the registration form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Submit - you should see "Waiting for admin approval" message
5. You'll be redirected to login page

### Step 3: Test Admin Approval
1. Login as admin again
2. Click "Admin Panel" button
3. You should see "Test User" in pending approvals
4. Click "Approve" button
5. User disappears from the list (approved)

### Step 4: Test Approved User Login
1. Logout
2. Login with:
   - Email: test@example.com
   - Password: test123
3. You should access the annotator
4. Notice: No "Admin Panel" button (not an admin)

### Step 5: Test Annotator Functionality
1. Select a batch (e.g., Batch 1)
2. Select a file
3. Click "Load Segments"
4. Verify segments load correctly
5. Test RSML annotation
6. Save annotations

## Features Breakdown

### For Regular Users:
- Register and wait for approval
- Login after approval
- Access annotator interface
- Save annotations
- Cannot access admin panel

### For Admin Users:
- All user features
- Access admin panel
- Approve/reject user registrations
- Full system access

## File Structure

```
BhashaCheck/
├── models/
│   ├── User.js (User schema with auth)
│   └── Voice.js (Voice data schema)
├── controllers/
│   ├── authController.js (Auth logic)
│   └── voiceController.js (Voice data logic)
├── routes/
│   ├── authRoutes.js (Auth endpoints)
│   └── voiceRoutes.js (Voice endpoints)
├── middleware/
│   └── authMiddleware.js (JWT protection)
├── scripts/
│   ├── createAdmin.js (Create admin user)
│   └── importCSV.js (Import data)
├── client/
│   └── src/
│       ├── components/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AdminPanel.jsx
│       │   ├── Annotator.jsx (Main app)
│       │   └── ProtectedRoute.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       └── App.jsx (Router setup)
└── server.js (Main server with auth)
```

## API Authentication

All `/api` routes (except `/api/auth/register` and `/api/auth/login`) now require authentication.

**Include token in requests:**
```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

This is automatically handled by the AuthContext.

## Database

**Users Collection:**
- Stores user credentials (hashed passwords)
- Tracks approval status
- Manages roles (user/admin)

**Voices Collection:**
- Original voice data
- RSML annotations
- Batch and file organization

## Security Notes

⚠️ **Change default admin password immediately!**
⚠️ **Update JWT_SECRET in production**
⚠️ **Use HTTPS in production**
⚠️ **Implement rate limiting for login attempts**

## Troubleshooting

**Can't login:**
- Check if user is approved (check MongoDB)
- Verify password is correct
- Check browser console for errors

**Token expired:**
- Logout and login again
- Token is stored in localStorage

**Admin panel not visible:**
- Only admin users see this button
- Check user role in MongoDB

**Registration not working:**
- Check MongoDB connection
- Verify all fields are filled
- Check browser console

## Next Steps

1. Change admin password
2. Test the complete workflow
3. Add more admin users if needed
4. Customize JWT expiration (currently 7 days)
5. Add email notifications (future enhancement)

## Support

For issues:
1. Check browser console (F12)
2. Check backend terminal logs
3. Verify MongoDB connection
4. Check [AUTH_README.md](AUTH_README.md) for detailed documentation

---

**System Status:** ✅ Ready for Use
**Servers Running:** Backend (3001) + Frontend (5173)
**Default Admin:** admin@example.com / admin123
