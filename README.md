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

1. Clone the repository
2. Install dependencies for both client and API
3. Set up Supabase project
4. Configure environment variables
5. Run development servers

### Development

- Client: `cd client && npm run dev`
- API: `cd api && npm run dev`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
