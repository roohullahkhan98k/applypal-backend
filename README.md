# ApplyPal Backend

A NestJS backend application for ApplyPal with JWT authentication for Ambassadors and Universities.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Separate modules for Ambassadors and Universities
- **Input Validation**: Comprehensive validation using class-validator
- **API Documentation**: Swagger/OpenAPI documentation
- **TypeScript**: Full TypeScript support
- **Modular Architecture**: Clean, scalable folder structure

## 📁 Project Structure

```
src/
├── common/                 # Shared modules and utilities
│   ├── auth/              # Authentication module
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── dto/               # Data Transfer Objects
│   │   ├── signup.dto.ts
│   │   ├── login.dto.ts
│   │   └── auth-response.dto.ts
│   └── interfaces/        # TypeScript interfaces
│       └── user.interface.ts
├── modules/               # Feature modules
│   ├── ambassador/        # Ambassador module
│   │   ├── ambassador.controller.ts
│   │   └── ambassador.module.ts
│   └── university/        # University module
│       ├── university.controller.ts
│       └── university.module.ts
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd applypal-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   NODE_ENV=development
   ```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000
- **Documentation**: http://localhost:3000/api/docs

## 📚 API Endpoints

### Ambassador Endpoints
- `POST /ambassador/signup` - Register as Ambassador
- `POST /ambassador/login` - Login as Ambassador
- `GET /ambassador/profile` - Get Ambassador profile (Protected)

### University Endpoints
- `POST /university/signup` - Register as University
- `POST /university/login` - Login as University
- `GET /university/profile` - Get University profile (Protected)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Examples

### Signup Request
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "university": "Harvard University",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "role": "ambassador"
}
```

### Login Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "ambassador"
}
```

### Auth Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "university": "Harvard University",
    "role": "ambassador"
  }
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## 🏗️ Architecture

- **Modular Design**: Each feature is organized in its own module
- **Shared Services**: Common functionality is shared through the `common` directory
- **DTOs**: Data validation and transformation using class-validator
- **Guards**: Route protection using JWT authentication guards
- **Interfaces**: TypeScript interfaces for type safety

## 🚧 Next Steps

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User profile management
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Role-based permissions
- [ ] File upload capabilities
- [ ] Rate limiting
- [ ] Logging and monitoring

## 📄 License

This project is licensed under the MIT License.
