# Ambassador Profile API Documentation

## Overview
Complete API for managing ambassador profiles with full CRUD operations, social links, following lists, and profile image handling.

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Ambassador Profile
**POST** `/ambassador/profile`

Creates a new ambassador profile with all fields including social links and profile image.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "subject": "Computer Science",
  "university": "MIT",
  "countryOriginal": "USA",
  "countryCurrent": "Canada",
  "social": {
    "facebook": "https://facebook.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "tiktok": "https://tiktok.com/@johndoe",
    "x": "https://x.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/johndoe",
    "following": ["user1", "user2", "user3"]
  },
  "calendlyLink": "https://calendly.com/johndoe",
  "writtenContent": "yes",
  "writtenDetails": "I write tech blogs",
  "profileImage": "/uploads/ambassador-profiles/image.jpg",
  "dob": "1995-06-15",
  "gender": "Male",
  "languages": ["English", "Spanish", "French"],
  "currentlyLivingCountry": "Canada",
  "phoneNumber": "+1234567890",
  "leaveAPYear": 2020,
  "previousSchoolName": "High School ABC",
  "currentlyUniversityStudent": "yes",
  "currentUniversityName": "MIT",
  "services": ["Mentoring", "Tutoring", "Career Guidance"],
  "whyStudyingCourse": "Passion for technology",
  "skilsExperience": "5 years in software development",
  "hobbiesInterests": "Reading, hiking, coding",
  "caringCauses": "Education accessibility",
  "accomplishmentsProudOf": "Built successful startup",
  "answerQ1": "Answer to question 1",
  "answerQ2": "Answer to question 2", 
  "answerQ3": "Answer to question 3",
  "answerQ4": "Answer to question 4",
  "question1": "What motivates you?",
  "question2": "Your biggest challenge?",
  "question3": "Future goals?",
  "isRegisteredAmbassador": "yes"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "subject": "Computer Science",
  "countryOriginal": "USA",
  "countryCurrent": "Canada",
  "currentlyLivingCountry": "Canada",
  "phoneNumber": "+1234567890",
  "dob": "1995-06-15T00:00:00.000Z",
  "gender": "Male",
  "languages": ["English", "Spanish", "French"],
  "leaveAPYear": 2020,
  "previousSchoolName": "High School ABC",
  "currentlyUniversityStudent": "yes",
  "currentUniversityName": "MIT",
  "calendlyLink": "https://calendly.com/johndoe",
  "writtenContent": "yes",
  "writtenDetails": "I write tech blogs",
  "profileImage": "/uploads/ambassador-profiles/image.jpg",
  "services": ["Mentoring", "Tutoring", "Career Guidance"],
  "whyStudyingCourse": "Passion for technology",
  "skilsExperience": "5 years in software development",
  "hobbiesInterests": "Reading, hiking, coding",
  "caringCauses": "Education accessibility",
  "accomplishmentsProudOf": "Built successful startup",
  "answerQ1": "Answer to question 1",
  "answerQ2": "Answer to question 2",
  "answerQ3": "Answer to question 3",
  "answerQ4": "Answer to question 4",
  "question1": "What motivates you?",
  "question2": "Your biggest challenge?",
  "question3": "Future goals?",
  "isRegisteredAmbassador": "yes",
  "createdAt": "2025-01-07T10:00:00.000Z",
  "updatedAt": "2025-01-07T10:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "university": "MIT",
    "role": "ambassador"
  },
  "socialLinks": {
    "id": "social-uuid",
    "facebook": "https://facebook.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "tiktok": "https://tiktok.com/@johndoe",
    "x": "https://x.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/johndoe"
  },
  "following": [
    {
      "id": "following-uuid-1",
      "platform": "instagram",
      "username": "user1"
    },
    {
      "id": "following-uuid-2", 
      "platform": "tiktok",
      "username": "user2"
    },
    {
      "id": "following-uuid-3",
      "platform": "youtube", 
      "username": "user3"
    }
  ]
}
```

### 2. Get My Profile
**GET** `/ambassador/profile`

Retrieves the current user's ambassador profile with all related data.

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "subject": "Computer Science",
  "countryOriginal": "USA",
  "countryCurrent": "Canada",
  "currentlyLivingCountry": "Canada",
  "phoneNumber": "+1234567890",
  "dob": "1995-06-15T00:00:00.000Z",
  "gender": "Male",
  "languages": ["English", "Spanish", "French"],
  "leaveAPYear": 2020,
  "previousSchoolName": "High School ABC",
  "currentlyUniversityStudent": "yes",
  "currentUniversityName": "MIT",
  "calendlyLink": "https://calendly.com/johndoe",
  "writtenContent": "yes",
  "writtenDetails": "I write tech blogs",
  "profileImage": "/uploads/ambassador-profiles/image.jpg",
  "services": ["Mentoring", "Tutoring", "Career Guidance"],
  "whyStudyingCourse": "Passion for technology",
  "skilsExperience": "5 years in software development",
  "hobbiesInterests": "Reading, hiking, coding",
  "caringCauses": "Education accessibility",
  "accomplishmentsProudOf": "Built successful startup",
  "answerQ1": "Answer to question 1",
  "answerQ2": "Answer to question 2",
  "answerQ3": "Answer to question 3",
  "answerQ4": "Answer to question 4",
  "question1": "What motivates you?",
  "question2": "Your biggest challenge?",
  "question3": "Future goals?",
  "isRegisteredAmbassador": "yes",
  "createdAt": "2025-01-07T10:00:00.000Z",
  "updatedAt": "2025-01-07T10:00:00.000Z",
  "user": {
    "id": "user-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "university": "MIT",
    "role": "ambassador"
  },
  "socialLinks": {
    "id": "social-uuid",
    "facebook": "https://facebook.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "tiktok": "https://tiktok.com/@johndoe",
    "x": "https://x.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/johndoe"
  },
  "following": [
    {
      "id": "following-uuid-1",
      "platform": "instagram",
      "username": "user1"
    }
  ]
}
```

### 3. Update Profile
**PUT** `/ambassador/profile`

Updates the current user's ambassador profile. All fields are optional.

**Request Body:**
```json
{
  "subject": "Updated Computer Science",
  "languages": ["English", "Spanish", "French", "German"],
  "services": ["Mentoring", "Tutoring", "Career Guidance", "Interview Prep"],
  "profileImage": "/uploads/ambassador-profiles/new-image.jpg",
  "social": {
    "facebook": "https://facebook.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "tiktok": "https://tiktok.com/@johndoe",
    "x": "https://x.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/johndoe",
    "following": ["user1", "user2", "user3", "user4"]
  }
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "subject": "Updated Computer Science",
  "languages": ["English", "Spanish", "French", "German"],
  "services": ["Mentoring", "Tutoring", "Career Guidance", "Interview Prep"],
  "profileImage": "/uploads/ambassador-profiles/new-image.jpg",
  "updatedAt": "2025-01-07T11:00:00.000Z",
  "socialLinks": {
    "id": "social-uuid",
    "facebook": "https://facebook.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "tiktok": "https://tiktok.com/@johndoe",
    "x": "https://x.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "youtube": "https://youtube.com/johndoe"
  },
  "following": [
    {
      "id": "following-uuid-1",
      "platform": "instagram",
      "username": "user1"
    },
    {
      "id": "following-uuid-2",
      "platform": "tiktok", 
      "username": "user2"
    },
    {
      "id": "following-uuid-3",
      "platform": "youtube",
      "username": "user3"
    },
    {
      "id": "following-uuid-4",
      "platform": "linkedin",
      "username": "user4"
    }
  ]
}
```

### 4. Get Profile by User ID
**GET** `/ambassador/profile/{userId}`

Retrieves a specific ambassador profile by user ID.

**Response (200 OK):**
Same structure as "Get My Profile" response.

### 5. Get All Profiles
**GET** `/ambassador/profiles`

Retrieves all ambassador profiles with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**
```json
{
  "profiles": [
    {
      "id": "uuid-string",
      "userId": "user-uuid",
      "subject": "Computer Science",
      "profileImage": "/uploads/ambassador-profiles/image.jpg",
      "user": {
        "id": "user-uuid",
        "fullName": "John Doe",
        "email": "john@example.com",
        "university": "MIT",
        "role": "ambassador"
      },
      "socialLinks": {
        "facebook": "https://facebook.com/johndoe",
        "instagram": "https://instagram.com/johndoe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 6. Delete Profile
**DELETE** `/ambassador/profile`

Deletes the current user's ambassador profile and all associated data.

**Response (200 OK):**
```json
{
  "message": "Ambassador profile deleted successfully",
  "deletedProfile": {
    "id": "uuid-string",
    "userId": "user-uuid"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Ambassador profile not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Ambassador profile already exists for this user"
}
```

## Data Types

### Social Links Object
```json
{
  "facebook": "string",
  "instagram": "string", 
  "tiktok": "string",
  "x": "string",
  "linkedin": "string",
  "youtube": "string",
  "following": ["string"]
}
```

### Following Array
Each following item is automatically assigned a platform based on the social media type:
- Instagram usernames → platform: "instagram"
- TikTok usernames → platform: "tiktok"  
- YouTube usernames → platform: "youtube"
- LinkedIn usernames → platform: "linkedin"
- X/Twitter usernames → platform: "x"
- Facebook usernames → platform: "facebook"

## Notes

1. **Profile Image**: Can be provided as a file path string in the request body
2. **Social Links**: The `following` array in social object is automatically processed and stored in the `Following` table
3. **Cascade Delete**: Deleting a user automatically deletes their ambassador profile and all related data
4. **Validation**: All fields are optional, but proper data types are enforced
5. **Authentication**: All endpoints require valid JWT token
6. **File Uploads**: Profile images are served from `/uploads/ambassador-profiles/` directory
