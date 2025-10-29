# Password Change API Documentation

## Overview
Two-step password change API for both Ambassador and University users. The API requires JWT authentication and works for users with any role.


## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Verify Current Password
**POST** `/auth/verify-password`

Verifies the user's current password before allowing password change.

**Request Body:**
```json
{
  "currentPassword": "currentPassword123"
}
```

**Response (200 OK):**
```json
{
  "isValid": true
}
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid password",
  "error": "Unauthorized"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": ["Password must be at least 6 characters long"],
  "error": "Bad Request"
}
```

### 2. Change Password
**POST** `/auth/change-password`

Changes the user's password after verifying the current password.

**Request Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "New password and confirm password do not match",
  "error": "Bad Request"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "New password must be different from current password",
  "error": "Bad Request"
}
```

## Validation Rules

### Password Requirements:
- Minimum 6 characters
- Must be a string
- Cannot be empty

### Change Password Requirements:
- Current password must be correct
- New password must be at least 6 characters
- New password and confirm password must match
- New password must be different from current password

## Usage Examples

### Frontend Implementation (React/JavaScript)

#### Step 1: Verify Password
```javascript
const verifyPassword = async (currentPassword) => {
  try {
    const token = getTokenFromCookies(); // Your token extraction logic
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-password`,
      { currentPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.isValid;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};
```

#### Step 2: Change Password
```javascript
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const token = getTokenFromCookies(); // Your token extraction logic
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      { currentPassword, newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.message;
  } catch (error) {
    console.error('Password change failed:', error);
    throw error;
  }
};
```

### Complete Frontend Flow
```javascript
const handlePasswordChange = async () => {
  try {
    // Step 1: Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      setError('Current password is incorrect');
      return;
    }
    
    // Step 2: Change password
    const result = await changePassword(currentPassword, newPassword, confirmPassword);
    setSuccessMessage(result);
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
  } catch (error) {
    setError(error.response?.data?.message || 'Password change failed');
  }
};
```

## Error Handling

### Common Error Scenarios:

1. **Invalid Token**: 401 Unauthorized
   - Solution: Re-login to get a new token

2. **Incorrect Current Password**: 401 Unauthorized
   - Solution: Verify the current password is correct

3. **Password Mismatch**: 400 Bad Request
   - Solution: Ensure new password and confirm password match

4. **Same Password**: 400 Bad Request
   - Solution: Choose a different new password

5. **Validation Errors**: 400 Bad Request
   - Solution: Ensure all fields meet the minimum requirements

## Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
- **Current Password Verification**: Must verify current password before changing
- **Input Validation**: All inputs are validated for type, length, and format
- **Role Agnostic**: Works for both Ambassador and University users

## Notes

- Both endpoints work for users with any role (ambassador or university)
- The API uses the same authentication system as other endpoints
- Password changes are immediately effective - users will need to use the new password for future logins
- The old password becomes invalid immediately after a successful password change
