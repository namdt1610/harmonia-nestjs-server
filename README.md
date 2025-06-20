# Harmonia NestJS Backend

A comprehensive music streaming backend built with NestJS, TypeScript, and PostgreSQL. This is a modern replacement for the Django backend, offering better type safety, performance, and developer experience.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth integration
  - Role-based access control
  - Password reset functionality

- **Music Management**
  - Track upload and streaming
  - Artist and album management
  - Genre categorization
  - Playlist creation and management
  - Favorites system

- **Subscription System**
  - Multiple subscription plans (Free, Premium, Family, Student, Artist)
  - Usage tracking and limitations
  - Stripe payment integration
  - Subscription analytics

- **Advanced Features**
  - Real-time WebSocket support
  - Full-text search
  - File upload with validation
  - Rate limiting
  - Analytics and user activity tracking
  - Caching with Redis

### API Features
- **RESTful API** with comprehensive endpoints
- **OpenAPI/Swagger** documentation
- **TypeScript** for type safety
- **Validation** with class-validator
- **Error handling** with custom exception filters
- **CORS** configuration
- **Throttling** for rate limiting

## 🛠 Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js + JWT
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Validation**: class-validator
- **Caching**: Redis
- **Payment**: Stripe
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- npm or yarn

## 🚦 Quick Start

1. **Clone and Install**
   ```bash
   cd harmonia-nestjs-server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb harmonia
   
   # Run migrations (auto-sync enabled in development)
   npm run start:dev
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

5. **Access the Application**
   - API: http://localhost:8000/api
   - Swagger Docs: http://localhost:8000/api/docs

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── strategies/       # Passport strategies
│   ├── guards/          # Auth guards
│   └── dto/             # Data transfer objects
├── users/               # User management
├── tracks/              # Music tracks
├── artists/             # Artist management
├── albums/              # Album management
├── playlists/           # Playlist features
├── subscription-plans/  # Subscription system
├── entities/            # TypeORM entities
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Custom guards
│   ├── interceptors/    # Request/response interceptors
│   └── pipes/           # Validation pipes
└── main.ts              # Application entry point
```

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=harmonia

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DEST=./uploads

# Server
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

## 🗄 Database Schema

### Key Entities

- **User**: User accounts with profiles and preferences
- **Artist**: Music artists with bio and image
- **Album**: Music albums with metadata
- **Track**: Individual music tracks with file references
- **Playlist**: User-created playlists
- **Genre**: Music genre categorization
- **SubscriptionPlan**: Available subscription tiers
- **UserSubscription**: User subscription status and usage
- **UserActivity**: User interaction tracking

## 🔐 Authentication

### JWT Strategy
```typescript
// Protected route example
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return req.user;
}
```

### Public Route
```typescript
@Public()
@Get('public-endpoint')
async publicEndpoint() {
  return 'This is public';
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Tracks
- `GET /api/tracks` - List tracks
- `POST /api/tracks` - Upload track
- `GET /api/tracks/:id` - Get track details
- `PUT /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track

### Artists
- `GET /api/artists` - List artists
- `POST /api/artists` - Create artist
- `GET /api/artists/:id` - Get artist details

### Albums
- `GET /api/albums` - List albums
- `POST /api/albums` - Create album
- `GET /api/albums/:id` - Get album details

### Playlists
- `GET /api/playlists` - List user playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t harmonia-api .

# Run with docker-compose
docker-compose up -d
```

### Production Environment
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📊 Monitoring & Analytics

- User activity tracking
- Subscription usage metrics
- Track play counts
- Performance monitoring
- Error logging

## 🔧 Development

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Husky git hooks

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- Documentation: http://localhost:8000/api/docs
- Issues: Create an issue on GitHub
- Email: support@harmonia.com

---

Built with ❤️ using NestJS and TypeScript
