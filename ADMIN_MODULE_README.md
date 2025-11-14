# Super Admin Module - Complete Documentation

## 🎯 Overview

The Super Admin module provides comprehensive administrative access to view and manage all data in the ApplyPal system. Admins can view all universities, ambassadors, chat messages, invitations, and system analytics.

## 📁 Module Structure

```
src/modules/admin/
├── admin.controller.ts      # All admin API endpoints
├── admin.service.ts         # Business logic for admin operations
├── admin.module.ts         # Module configuration
├── dto/
│   └── admin-response.dto.ts # Response DTOs for admin endpoints
└── ADMIN_SETUP.md          # Setup instructions
```

## 🔐 Authentication & Authorization

- **Authentication**: JWT Bearer token required
- **Authorization**: Only users with `role: 'admin'` can access admin endpoints
- **Guard**: `AdminGuard` enforces admin-only access

## 📊 Admin Endpoints

### Dashboard & Statistics

#### `GET /admin/dashboard/stats`
Get overall system statistics.

**Response:**
```json
{
  "totalUsers": 150,
  "totalUniversities": 45,
  "totalAmbassadors": 105,
  "totalChatClicks": 1250,
  "totalInvitations": 320,
  "activeWidgets": 38,
  "verifiedWidgets": 35,
  "recentChatClicks": 45,
  "recentSignups": 12
}
```

### Universities Management

#### `GET /admin/universities?page=1&limit=50`
Get all universities with statistics.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "universities": [
    {
      "id": "uuid",
      "userId": "uuid",
      "fullName": "Harvard University",
      "email": "harvard@example.com",
      "university": "Harvard University",
      "widgetId": "uuid",
      "isVerified": true,
      "universityEmail": "contact@harvard.edu",
      "totalInvitations": 25,
      "totalChatClicks": 180,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 50,
  "totalPages": 1
}
```

### Ambassadors Management

#### `GET /admin/ambassadors?page=1&limit=50`
Get all ambassadors with their profiles.

**Response:**
```json
{
  "ambassadors": [
    {
      "id": "uuid",
      "userId": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "university": "Harvard University",
      "subject": "Computer Science",
      "countryOriginal": "USA",
      "countryCurrent": "UK",
      "currentUniversityName": "Harvard University",
      "profileImage": "/uploads/ambassador-profiles/image.jpg",
      "hasProfile": true,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 105,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

### Chat Clicks & Messages

#### `GET /admin/chat-clicks?page=1&limit=100`
Get all chat clicks/messages with full details.

**Response:**
```json
{
  "chatClicks": [
    {
      "id": "uuid",
      "widgetId": "uuid",
      "domain": "example.com",
      "ipAddress": "192.168.1.1",
      "country": "United States",
      "ambassadorId": "uuid",
      "ambassadorName": "John Doe",
      "question1Answer": "I want to know about admissions",
      "question2Answer": "What are the requirements?",
      "clickedAt": "2025-01-01T00:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "universityName": "Harvard University"
    }
  ],
  "total": 1250,
  "page": 1,
  "limit": 100,
  "totalPages": 13
}
```

### Invitations Management

#### `GET /admin/invitations?page=1&limit=100`
Get all invitations with status.

**Response:**
```json
{
  "invitations": [
    {
      "id": "uuid",
      "universityId": "uuid",
      "universityName": "Harvard University",
      "ambassadorName": "John Doe",
      "ambassadorEmail": "john@example.com",
      "status": "JOINED",
      "invitedAt": "2025-01-01T00:00:00Z",
      "respondedAt": "2025-01-01T01:00:00Z"
    }
  ],
  "total": 320,
  "page": 1,
  "limit": 100,
  "totalPages": 4
}
```

### Users Management

#### `GET /admin/users?page=1&limit=50`
Get all users (universities and ambassadors).

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "university": "Harvard University",
      "role": "ambassador",
      "hasAmbassadorProfile": true,
      "hasUniversityProfile": false,
      "widgetId": null,
      "isVerified": false,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

#### `GET /admin/users/:userId`
Get detailed information about a specific user.

**Response:**
```json
{
  "id": "uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "ambassador",
  "ambassadorProfile": {
    // Full ambassador profile with social links, following, etc.
  },
  "chatClickCount": 0
}
```

#### `DELETE /admin/users/:userId`
Delete a user (cannot delete admin users).

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ambassador"
  }
}
```

### Analytics

#### `GET /admin/analytics/countries`
Get chat click statistics grouped by country.

**Response:**
```json
[
  { "country": "United States", "count": 450 },
  { "country": "United Kingdom", "count": 320 },
  { "country": "Canada", "count": 180 }
]
```

#### `GET /admin/analytics/widgets`
Get analytics for all widgets.

**Response:**
```json
[
  {
    "widgetId": "uuid",
    "universityName": "Harvard University",
    "universityEmail": "contact@harvard.edu",
    "isVerified": true,
    "totalInvitations": 25,
    "totalChatClicks": 180,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

## 🚀 Creating an Admin User

### Method 1: Using NPM Script (Recommended)
```bash
npm run admin:create admin@applypal.com SecurePassword123! "Super Admin"
```

### Method 2: Using Node.js Directly
```bash
node scripts/create-admin.js admin@applypal.com SecurePassword123! "Super Admin"
```

### Method 3: Using Prisma Studio
```bash
npm run prisma:studio
```
Then manually create a user with `role: 'admin'`

### Method 4: Using SQL
```sql
INSERT INTO users (id, full_name, email, university, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Super Admin',
  'admin@applypal.com',
  'ApplyPal System',
  '$2a$10$YourHashedPasswordHere', -- Hash password with bcrypt
  'admin',
  NOW(),
  NOW()
);
```

## 🔒 Security Features

1. **Admin Signup Prevention**: Admin accounts cannot be created via `/auth/signup`
2. **Role-Based Access**: Only users with `role: 'admin'` can access admin endpoints
3. **Admin Protection**: Admin users cannot be deleted through the API
4. **JWT Authentication**: All endpoints require valid JWT token
5. **Admin Guard**: `AdminGuard` enforces admin-only access

## 📝 Usage Example

### 1. Create Admin User
```bash
npm run admin:create admin@applypal.com AdminPass123! "Super Admin"
```

### 2. Login as Admin
```bash
POST /auth/login
{
  "email": "admin@applypal.com",
  "password": "AdminPass123!",
  "role": "admin"
}
```

### 3. Access Admin Endpoints
```bash
GET /admin/dashboard/stats
Authorization: Bearer <admin-jwt-token>
```

## 🎨 Features Included

✅ **Dashboard Statistics**: Overall system metrics  
✅ **University Management**: View all universities with stats  
✅ **Ambassador Management**: View all ambassadors with profiles  
✅ **Chat Click Tracking**: View all messages and interactions  
✅ **Invitation Management**: View all invitations and statuses  
✅ **User Management**: View and delete users  
✅ **Analytics**: Country-based and widget-based analytics  
✅ **Pagination**: All list endpoints support pagination  
✅ **Detailed Views**: Get full details for any user  

## 📚 API Documentation

All admin endpoints are documented in Swagger at:
```
http://localhost:3000/api/docs
```

Look for the **Admin** tag in the Swagger UI.

## ⚠️ Important Notes

1. **Admin Creation**: Admins must be created manually (not via signup)
2. **Password Security**: Use strong passwords for admin accounts
3. **Token Expiry**: Admin JWT tokens expire in 3 days (same as other users)
4. **Database Migration**: Run `npx prisma migrate dev` to add admin role to enum
5. **Prisma Client**: Run `npx prisma generate` after schema changes

## 🔄 Next Steps

1. Run Prisma migration to add admin role:
   ```bash
   npx prisma migrate dev --name add_admin_role
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Create your first admin user:
   ```bash
   npm run admin:create your-admin@email.com YourSecurePassword! "Admin Name"
   ```

4. Login and start using admin endpoints!

---

**Module Created**: November 2025  
**Version**: 1.0.0

