# TasteMatch API Documentation (OpenAPI 3.0)

## Overview

This document describes the REST API for the TasteMatch application. The API provides endpoints for dish search, user management, favorites, and restaurant information.

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.tastematch.com/api
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "total": 0
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1642248000000
    }
  },
  "message": "Signed in successfully"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "stats": {
      "favorites": 24,
      "reviews": 156,
      "photos": 89
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Search

#### Search Dishes
```http
GET /search/dishes?q=ramen&location=90210&limit=20
```

**Query Parameters:**
- `q` (string): Search query
- `location` (string): Location filter
- `limit` (integer): Maximum results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Spicy Ramen",
      "restaurant": "Ramen House",
      "location": "Downtown",
      "rating": 4.8,
      "flavors": ["Spicy", "Savory", "Rich"],
      "image": "https://example.com/dish.jpg"
    }
  ],
  "total": 1
}
```

#### Search by Flavor
```http
GET /search/flavors?flavors=spicy,savory&location=90210
```

**Query Parameters:**
- `flavors` (string): Comma-separated flavor list
- `location` (string): Location filter

#### Search by Image
```http
POST /search/image
Content-Type: multipart/form-data

image: <file>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Similar Dish Found",
      "restaurant": "Restaurant Name",
      "confidence": 0.85
    }
  ]
}
```

### Favorites

#### Get Favorites
```http
GET /favorites
Authorization: Bearer <token>
```

#### Add Favorite
```http
POST /favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "dishId": "uuid",
  "notes": "Amazing spicy ramen!"
}
```

#### Remove Favorite
```http
DELETE /favorites/:id
Authorization: Bearer <token>
```

### Restaurants

#### Get Restaurants
```http
GET /restaurants?city=Los Angeles&cuisine=Japanese
```

**Query Parameters:**
- `city` (string): City filter
- `cuisine` (string): Cuisine type filter
- `rating` (float): Minimum rating filter

#### Get Restaurant Details
```http
GET /restaurants/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ramen House",
    "description": "Authentic Japanese ramen",
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "rating": 4.8,
    "priceRange": 2,
    "cuisineTypes": ["Japanese", "Asian"],
    "phone": "555-0123",
    "website": "https://ramenhouse.com"
  }
}
```

### Dishes

#### Get Dish Details
```http
GET /dishes/:id
```

#### Get Similar Dishes
```http
GET /dishes/:id/similar?limit=10
```

#### Add Review
```http
POST /dishes/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Amazing dish!",
  "images": ["https://example.com/review1.jpg"]
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting

- **General**: 100 requests per 15 minutes per IP
- **Image Upload**: 10 requests per hour per user
- **Search**: 60 requests per minute per user

## Data Models

### Dish
```typescript
interface Dish {
  id: string;
  name: string;
  description?: string;
  restaurant: string;
  location: string;
  rating: number;
  flavors: string[];
  image?: string;
  price?: number;
  dietaryRestrictions?: string[];
  spicyLevel?: number;
}
```

### Restaurant
```typescript
interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  rating: number;
  priceRange: number;
  cuisineTypes: string[];
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  stats: {
    favorites: number;
    reviews: number;
    photos: number;
  };
  createdAt: string;
}
```
