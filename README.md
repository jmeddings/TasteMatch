# TasteMatch

A mobile application that helps users find dishes and restaurants similar to foods they already enjoy.

## Overview

TasteMatch is a community-driven platform that analyzes taste and texture to recommend similar food options nearby. Users can search by dish, flavor, or photo, save favorites, and share their food experiences.

## Features

- **Smart Search**: Search by dish name, flavor profile, or photo upload
- **Taste Analysis**: AI-powered analysis of taste and texture similarities
- **Local Recommendations**: Find similar dishes and restaurants nearby
- **Save Favorites**: Build your personal collection of loved dishes
- **Community Sharing**: Share food experiences and discoveries
- **Progressive Web App**: Mobile-optimized PWA experience

## Tech Stack

- **Frontend**: React PWA (Vite for local development)
- **Backend**: Express.js API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)

## Project Structure

```
TasteMatch/
├── client/          # React PWA (local dev: Vite)
├── api/             # Express API (local dev: Node)
├── supabase/        # SQL migrations + seeds
├── docs/            # PRD, site map, OpenAPI, deployment notes
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TasteMatch
   ```

2. Install dependencies for both client and API:
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install API dependencies
   cd ../api
   npm install
   ```

3. Set up Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration files from `supabase/migrations/` in your Supabase SQL editor
   - Run the seed files from `supabase/seeds/` for sample data

4. Configure environment variables (see Environment Variables section below)

5. Run development servers (see Local Development section below)

### Environment Variables

Create the following environment files:

#### API Environment Variables (`api/.env`)

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Optional: External API Keys (for future features)
# GOOGLE_PLACES_API_KEY=your_google_places_api_key
# OPENAI_API_KEY=your_openai_api_key
```

#### Client Environment Variables (`client/.env`)

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:3001

# Optional: Feature Flags
VITE_ENABLE_IMAGE_SEARCH=true
VITE_ENABLE_AI_ANALYSIS=true
```

### Local Development

1. Start the backend API server:
   ```bash
   cd api
   npm run dev
   ```
   The API will be available at `http://localhost:3001`

2. In a separate terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   The client will be available at `http://localhost:5173`

3. Verify the setup:
   - API Health Check: Visit `http://localhost:3001/api/health`
   - Frontend: Visit `http://localhost:5173` in your browser

### Development Scripts

#### API Commands (`api/`)
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
npm test         # Run Jest tests
```

#### Client Commands (`client/`)
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Setup

1. After creating your Supabase project, navigate to the SQL Editor
2. Run the contents of `supabase/migrations/001_initial_schema.sql`
3. Optionally run `supabase/seeds/001_sample_data.sql` for sample data
4. Configure your Supabase Auth settings (enable email/password authentication)
5. Set up Storage buckets if needed for image uploads

### Troubleshooting

- **CORS Issues**: Ensure `CLIENT_URL` in your API `.env` matches your frontend dev server URL
- **Supabase Connection**: Verify your Supabase URL and keys are correct in both `.env` files
- **Port Conflicts**: Change the `PORT` in `api/.env` if 3001 is already in use
- **Database Permissions**: Ensure RLS policies are correctly set up in Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
