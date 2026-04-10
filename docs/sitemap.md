# TasteMatch Application Sitemap

## Mobile Application Structure

### Navigation
```
├── Search (Home)
│   ├── Text Search
│   ├── Flavor Search
│   ├── Photo Search
│   ├── Recent Searches
│   └── Popular Searches
├── Favorites
│   ├── Saved Dishes
│   ├── Saved Restaurants
│   └── Collections
└── Profile
    ├── User Information
    ├── Taste Preferences
    ├── Settings
    ├── History
    └── Social
```

### User Flow

#### New User Onboarding
1. **Welcome Screen** - App introduction and value proposition
2. **Sign Up/Sign In** - Authentication via Supabase
3. **Taste Profile Setup** - Initial preference selection
4. **Location Permissions** - Enable location-based recommendations
5. **Tutorial** - Guided tour of main features

#### Search Flow
1. **Search Input** - Text, flavor selection, or photo upload
2. **Results Display** - List of matching dishes with key info
3. **Detail View** - Full dish information and restaurant details
4. **Action Options** - Save favorite, get directions, share

#### Favorites Management
1. **View Favorites** - Grid/list of saved items
2. **Organize** - Create collections and tags
3. **Share** - Export favorites or share with friends

## API Endpoints Structure

### Authentication (`/api/auth`)
```
POST /api/auth/signup     - Create new user account
POST /api/auth/signin     - User login
POST /api/auth/signout    - User logout
GET  /api/auth/profile    - Get user profile
PUT  /api/auth/profile    - Update user profile
```

### Search (`/api/search`)
```
GET  /api/search/dishes   - Search dishes by text
GET  /api/search/flavors  - Search by flavor profile
POST /api/search/image    - Search by uploaded image
GET  /api/search/suggest  - Get search suggestions
```

### Favorites (`/api/favorites`)
```
GET    /api/favorites           - Get user favorites
POST   /api/favorites           - Add to favorites
DELETE /api/favorites/:id       - Remove from favorites
GET    /api/favorites/collections - Get collections
POST   /api/favorites/collections - Create collection
```

### Restaurants (`/api/restaurants`)
```
GET /api/restaurants           - Get restaurants list
GET /api/restaurants/:id       - Get restaurant details
GET /api/restaurants/nearby    - Get nearby restaurants
```

### Dishes (`/api/dishes`)
```
GET /api/dishes/:id            - Get dish details
GET /api/dishes/:id/similar    - Get similar dishes
POST /api/dishes/:id/review    - Add review
GET /api/dishes/:id/reviews   - Get dish reviews
```

## Database Schema Overview

### Core Tables
```
users (profiles)        - User account information
restaurants            - Restaurant details and location
dishes                 - Menu items and descriptions
flavor_profiles        - Taste and flavor taxonomy
dish_flavors          - Dish-flavor relationships
favorites             - User saved items
reviews               - User reviews and ratings
search_history        - User search activity
```

### Relationships
```
users 1:N favorites N:1 dishes
restaurants 1:N dishes
dishes N:M flavor_profiles
users 1:N reviews N:1 dishes
users 1:N search_history
```

## File Structure

### Frontend (`/client`)
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout
│   ├── SearchBar.tsx   # Search input component
│   ├── DishCard.tsx    # Dish display card
│   └── FlavorTag.tsx   # Flavor filter tags
├── pages/              # Main application pages
│   ├── Search.tsx      # Search functionality
│   ├── Favorites.tsx   # Favorites management
│   └── Profile.tsx     # User profile
├── hooks/              # Custom React hooks
├── services/           # API integration
├── utils/              # Helper functions
└── types/              # TypeScript definitions
```

### Backend (`/api`)
```
src/
├── routes/             # API route definitions
├── controllers/        # Business logic handlers
├── middleware/         # Express middleware
├── services/           # External service integrations
├── utils/              # Helper functions
└── types/              # TypeScript definitions
```

### Database (`/supabase`)
```
migrations/            # Schema changes
seeds/                 # Sample data
functions/             # Database functions
policies/              # RLS policies
```
