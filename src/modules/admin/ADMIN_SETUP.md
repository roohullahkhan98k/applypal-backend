# Super Admin Module Setup

## Overview

The Super Admin module provides comprehensive access to view and manage all data in the ApplyPal system.

## Creating an Admin User

Admin users cannot be created through the regular signup endpoint. You need to create them manually in the database.

### Option 1: Using Prisma Studio
```bash
npm run prisma:studio
```
Then manually create a user with `role: 'admin'`

### Option 2: Using SQL
```sql
INSERT INTO users (id, full_name, email, university, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@applypal.com',
  'ApplyPal System',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt to hash your password
  'admin',
  NOW(),
  NOW()
);
```

### Option 3: Using Node.js Script
Create a temporary script to hash password and create admin:
```javascript
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('YourSecurePassword123!', 10);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'admin@applypal.com',
      university: 'ApplyPal System',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin created:', admin);
}

createAdmin();
```

## Admin Endpoints

All admin endpoints require:
- JWT Authentication (Bearer token)
- Admin role in the JWT token

### Base URL
All admin endpoints are prefixed with `/admin`

### Endpoints

#### Dashboard Statistics
```
GET /admin/dashboard/stats
```
Returns overall system statistics.

#### View All Universities
```
GET /admin/universities?page=1&limit=50
```
Returns paginated list of all universities with statistics.

#### View All Ambassadors
```
GET /admin/ambassadors?page=1&limit=50
```
Returns paginated list of all ambassadors with profiles.

#### View All Chat Clicks/Messages
```
GET /admin/chat-clicks?page=1&limit=100
```
Returns paginated list of all chat clicks with messages.

#### View All Invitations
```
GET /admin/invitations?page=1&limit=100
```
Returns paginated list of all invitations.

#### View All Users
```
GET /admin/users?page=1&limit=50
```
Returns paginated list of all users (universities and ambassadors).

#### Country Analytics
```
GET /admin/analytics/countries
```
Returns chat click statistics grouped by country.

#### Widget Analytics
```
GET /admin/analytics/widgets
```
Returns analytics for all widgets.

#### Get User Details
```
GET /admin/users/:userId
```
Returns detailed information about a specific user.

#### Delete User
```
DELETE /admin/users/:userId
```
Deletes a user (cannot delete admin users).

## Security Notes

- Admin accounts cannot be created via signup endpoint
- Admin endpoints are protected by AdminGuard
- Only users with `role: 'admin'` can access these endpoints
- Admin users cannot be deleted through the API

