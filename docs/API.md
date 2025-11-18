# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Images

#### Get All Images
```http
GET /api/images?page=1&limit=20&category=galaxy&difficulty=3&source=nasa
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `difficulty` (number): Filter by difficulty (1-5)
- `source` (string): Filter by source (nasa, esa, hubble)

#### Get Single Image
```http
GET /api/images/:id
```

#### Get Random Image
```http
GET /api/images/random
Authorization: Bearer <token>
```

#### Fetch NASA Images (Admin/Researcher only)
```http
POST /api/images/fetch/nasa
Authorization: Bearer <token>
Content-Type: application/json

{
  "page": 1,
  "pageSize": 20
}
```

#### Fetch ESA Images (Admin/Researcher only)
```http
POST /api/images/fetch/esa
Authorization: Bearer <token>
Content-Type: application/json

{
  "limit": 20,
  "offset": 0
}
```

### Annotations

#### Create Annotation
```http
POST /api/annotations
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageId": 123,
  "type": "point",
  "coordinates": {
    "x": 100,
    "y": 150
  },
  "category": "galaxy",
  "confidence": 4,
  "description": "Spiral galaxy with clear arms"
}
```

#### Get Image Annotations
```http
GET /api/annotations/image/:imageId
```

#### Get User Annotations
```http
GET /api/annotations/user?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Consensus Annotations
```http
GET /api/annotations/consensus/:imageId
```

#### Validate Annotation (Researcher/Admin only)
```http
PUT /api/annotations/:id/validate
Authorization: Bearer <token>
```

### Users

#### Get User Profile
```http
GET /api/users/:id
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "avatarUrl": "string",
  "preferences": {}
}
```

#### Get Leaderboard
```http
GET /api/users/leaderboard?limit=50
```

#### Get User Statistics
```http
GET /api/users/stats
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
