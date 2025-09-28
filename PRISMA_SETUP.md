# Prisma Setup with Supabase

This guide will help you set up Prisma with your Supabase PostgreSQL database.

## 🗄️ Database Configuration

The application now uses Prisma ORM to connect to your Supabase PostgreSQL database. This provides better type safety, easier migrations, and seamless Supabase integration.

## 📋 Prerequisites

1. **Supabase Project**: You already have a Supabase project at `https://outcxanlccpcjkeestip.supabase.co`
2. **Database Password**: You'll need your Supabase database password

## 🔧 Setup Steps

### 1. Get Your Database Password

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `outcxanlccpcjkeestip`
3. Go to **Settings** → **Database**
4. Find your **Database Password** (you'll need this for the connection)

### 2. Create Environment File

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

# Prisma Database Configuration
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.outcxanlccpcjkeestip:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.outcxanlccpcjkeestip:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password in both URLs.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migration

```bash
npm run prisma:migrate
```

This will:
- Create the `users` table in your Supabase database
- Set up all necessary indexes and constraints
- Create the migration files

### 5. Start the Application

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

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:deploy` - Deploy migrations to production
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:reset` - Reset database and run all migrations

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
- Ensure the database URLs are correctly formatted

### Migration Issues
- Make sure you have the correct database permissions
- Check the console logs for specific error messages
- Verify that the database exists and is accessible

## 📊 Database Features

- **UUID Primary Keys**: Each user gets a unique UUID
- **Email Uniqueness**: Prevents duplicate email registrations
- **Role Validation**: Ensures only valid roles (ambassador/university)
- **Automatic Timestamps**: Created/updated timestamps are managed automatically
- **Password Hashing**: Passwords are securely hashed using bcrypt
- **Type Safety**: Full TypeScript support with Prisma

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **SQL Injection Protection**: Prisma provides built-in protection
- **Connection Pooling**: Efficient database connections with Supabase

## 🎯 Key Benefits of Prisma

- **Type Safety**: Full TypeScript support with auto-generated types
- **Easy Migrations**: Simple database schema changes
- **Great DX**: Excellent developer experience with Prisma Studio
- **Supabase Integration**: Seamless connection to Supabase
- **Performance**: Optimized queries and connection pooling

Your database is now ready to use with Prisma and Supabase! 🚀
