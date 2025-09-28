# Database Setup with Supabase + Sequelize

This guide will help you set up the database using Supabase with Sequelize ORM.

## 🗄️ Database Configuration

The application uses Sequelize ORM to connect to your Supabase PostgreSQL database. This gives you the best of both worlds - Supabase's managed PostgreSQL with Sequelize's powerful ORM features.

## 📋 Prerequisites

1. **Supabase Project**: You already have a Supabase project at `https://outcxanlccpcjkeestip.supabase.co`
2. **Supabase API Key**: You already have your API key

## 🔧 Setup Steps

### 1. Create Environment File

Create a `.env` file in your project root:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://outcxanlccpcjkeestip.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGN4YW5sY2NwY2prZWVzdGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTIwNjcsImV4cCI6MjA3NDYyODA2N30.qf3vjiOtrlkKRB_Yh5B2o4T-ABNHrsYV72HBwsZqXRw
```

**That's it!** No need for database passwords or complex setup.

### 3. Initialize Database

Run the database initialization script:

```bash
npm run db:init
```

This will:
- Connect to your PostgreSQL database
- Create the `users` table automatically
- Set up all necessary indexes and constraints

### 4. Start the Application

```bash
npm run start:dev
```

## 🏗️ Database Schema

The `users` table will be created with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  university VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ambassador', 'university')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔍 Available Scripts

- `npm run db:init` - Initialize database and create tables
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🧪 Testing the Setup

Once the database is set up, you can test the API endpoints:

### Ambassador Signup
```bash
POST http://localhost:3000/ambassador/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "university": "Harvard University",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "ambassador"
}
```

### University Login
```bash
POST http://localhost:3000/university/login
Content-Type: application/json

{
  "email": "university@example.com",
  "password": "SecurePass123!",
  "role": "university"
}
```

## 🚨 Troubleshooting

### Connection Issues
- Verify your database password in the `.env` file
- Check that your Supabase project is active
- Ensure the database host URL is correct

### Table Creation Issues
- Make sure you have the correct database permissions
- Check the console logs for specific error messages
- Verify that the database exists and is accessible

## 📊 Database Features

- **UUID Primary Keys**: Each user gets a unique UUID
- **Email Uniqueness**: Prevents duplicate email registrations
- **Role Validation**: Ensures only valid roles (ambassador/university)
- **Automatic Timestamps**: Created/updated timestamps are managed automatically
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Indexes**: Optimized queries with email and role indexes

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **SQL Injection Protection**: Sequelize provides built-in protection

Your database is now ready to use with the ApplyPal backend! 🚀
