# Desktop App Authentication API Documentation

This document provides comprehensive information on how to integrate your desktop application with the Easy Picsy backend authentication system.

## Base URL

```
http://localhost:3000/api/auth
```

## Authentication Overview

The backend uses Supabase for authentication with JWT tokens. All authenticated endpoints require the `Authorization` header with a Bearer token.

## API Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe" // optional
}
```

**Response (Success - 201):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  }
}
```

**Response (Error - 409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "User already exists"
}
```

**Validation Requirements:**
- `email`: Must be a valid email address
- `password`: Minimum 6 characters
- `fullName`: Optional string

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.MjAyNC0wOS0wMVQxNDozMDowMFo...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Response (Error - 401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### 3. Token Refresh

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "v1.MjAyNC0wOS0wMVQxNDozMDowMFo..."
}
```

**Response (Success - 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.MjAyNC0wOS0wMVQxNDozMDowMFo..."
}
```

---

### 4. User Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "message": "Logout successful"
}
```

---

### 5. Get User Profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "supabaseId": "uuid-here",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": null,
  "role": "user",
  "metadata": {},
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T14:30:00Z",
  "lastLoginAt": "2024-09-01T14:30:00Z"
}
```

---

### 6. Verify Token

**Endpoint:** `GET /auth/verify`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Authentication Flow for Desktop Apps

### Initial Setup

1. **Environment Configuration**
   - Set your backend base URL in your desktop app configuration
   - Default: `http://localhost:3000/api`

### Authentication Process

1. **User Registration/Login**
   ```javascript
   // Registration
   const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123',
       fullName: 'John Doe'
     })
   });

   // Login
   const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123'
     })
   });

   const { access_token, refresh_token, user } = await loginResponse.json();
   ```

2. **Store Tokens Securely**
   - Store `access_token` and `refresh_token` in your desktop app's secure storage
   - Never store tokens in plain text files

3. **Making Authenticated Requests**
   ```javascript
   const response = await fetch('http://localhost:3000/api/auth/profile', {
     headers: {
       'Authorization': `Bearer ${access_token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

4. **Token Refresh**
   ```javascript
   // When access token expires (401 response)
   const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       refresh_token: stored_refresh_token
     })
   });

   const { access_token: newAccessToken, refresh_token: newRefreshToken } = 
     await refreshResponse.json();
   ```

5. **Logout**
   ```javascript
   await fetch('http://localhost:3000/api/auth/logout', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${access_token}`
     }
   });
   ```

### Error Handling

Common HTTP status codes and their meanings:

- **200**: Success
- **201**: Created (registration successful)
- **401**: Unauthorized (invalid credentials or expired token)
- **409**: Conflict (user already exists)
- **422**: Validation error (invalid request data)
- **500**: Internal server error

### Token Management Best Practices

1. **Token Storage**: Use your platform's secure storage (Keychain on macOS, Windows Credential Manager, etc.)
2. **Automatic Refresh**: Implement automatic token refresh when receiving 401 errors
3. **Token Expiration**: Check token validity before making requests
4. **Secure Communication**: Always use HTTPS in production

### Example Desktop App Integration

```javascript
class AuthService {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.refreshToken = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    // Store tokens securely
    await this.storeTokens(data.access_token, data.refresh_token);
    
    return data.user;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    let response = await fetch(url, { ...options, headers });

    // If token expired, try to refresh
    if (response.status === 401) {
      await this.refreshAccessToken();
      headers['Authorization'] = `Bearer ${this.accessToken}`;
      response = await fetch(url, { ...options, headers });
    }

    return response;
  }

  async refreshAccessToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    await this.storeTokens(data.access_token, data.refresh_token);
  }

  async storeTokens(accessToken, refreshToken) {
    // Implement secure token storage for your platform
  }

  async logout() {
    if (this.accessToken) {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
    }
    
    this.accessToken = null;
    this.refreshToken = null;
    // Clear stored tokens
  }
}
```

## Testing the API

You can test the authentication endpoints using curl:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Environment Variables Required

Ensure your backend has these environment variables configured:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d
PORT=3000
```