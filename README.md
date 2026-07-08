# 🐾 PawPath - Pet Adoption Platform

A full-stack pet adoption platform where adopters can find pets, shelters can manage listings, and admins can verify shelters.

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Prisma ORM
- JWT authentication with bcryptjs
- Zod validation
- Multer for file uploads

### Frontend
- React with TypeScript
- Vite build tool
- Tailwind CSS
- Zustand for state management
- TanStack Query for data fetching
- React Router for navigation

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Supabase account)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pet-adoption-platform.git
cd pet-adoption-platform
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pet_adoption"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

Run database migrations:
```bash
npx prisma migrate deploy
```

Seed admin user:
```bash
node scripts/seedAdmin.js
```
Default admin: `Merry@gmail.com` / `Merry123`

Start the server:
```bash
npm run dev
```
Server runs at: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```
Client runs at: `http://localhost:5173`

### 4. Test the Application

1. Visit `http://localhost:5173`
2. Create an account as adopter or shelter staff
3. Or use the seeded admin: `Merry@gmail.com` / `Merry123`

## Key Features

- **Adopters**: Browse pets, apply for adoption, save favorites, share updates
- **Shelter Staff**: Manage shelter profile, list pets, review applications
- **Admins**: Verify shelters, review reported posts

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/pets` | List pets with filters |
| POST | `/api/applications` | Submit adoption application |
| GET | `/api/applications/mine` | Get my applications |
| POST | `/api/shelters` | Create shelter |
| GET | `/api/feed` | Get public feed |

## Database Schema

The schema includes models for Users, Shelters, Pets, Applications, Favorites, and Feed posts.
