# Harmonia Music Streaming Backend

A comprehensive NestJS backend for a music streaming platform with MongoDB, featuring real-time capabilities, AI-powered recommendations, and payment processing.

## 🎵 Features

### Core Music Management
- **Tracks**: Upload, manage, and stream music tracks with metadata
- **Artists**: Artist profiles, management, and analytics
- **Albums**: Album collections with track management
- **Genres**: Music categorization and genre-based filtering
- **Playlists**: User playlists with collaboration features

### User Experience
- **User Management**: Registration, authentication, profiles
- **Favorites**: Like/unlike tracks, albums, artists, playlists
- **Advanced Search**: Multi-faceted search across all content types
- **Stream Queue**: Real-time playback queue management
- **AI Chatbot**: Intelligent music recommendations and assistance

### Premium Features
- **Subscription Plans**: Multiple tier management
- **Stripe Payments**: Complete payment processing and billing
- **Analytics Dashboard**: Comprehensive platform and user analytics
- **Real-time Notifications**: WebSocket-based notifications and email alerts

### Technical Features
- **RESTful API**: Complete REST endpoints with Swagger documentation
- **Real-time WebSocket**: Live queue updates and notifications
- **File Upload**: Support for audio files and images
- **Email System**: Transactional emails with templates
- **Scheduled Tasks**: Automated analytics and cleanup jobs

## 🚀 Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO WebSocket
- **Payments**: Stripe integration
- **Email**: Nodemailer with SMTP
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer with local/cloud storage
- **Scheduling**: Cron jobs for analytics

## 📦 Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB (v4.4 or later)
- npm or yarn

### Setup Steps

1. **Clone and install dependencies**:
```bash
cd harmonia-nestjs-server
npm install
```

2. **Environment Configuration**:
```bash
cp env.example .env
```

3. **Configure your .env file**:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/harmonia

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Harmonia Music" <noreply@harmonia.com>

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
PORT=3000
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
sudo systemctl start mongod
```

5. **Run the application**:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

#### Music Content
- `GET /api/tracks` - List tracks with filters
- `POST /api/tracks` - Upload new track
- `GET /api/artists` - List artists
- `GET /api/albums` - List albums
- `GET /api/playlists` - User playlists

#### Search & Discovery
- `GET /api/search` - Advanced search
- `GET /api/search/suggestions` - Search suggestions
- `GET /api/analytics/dashboard` - Platform analytics

#### Real-time Features
- `WebSocket /ws` - Real-time connections
- `GET /api/stream-queue` - Get user queue
- `POST /api/stream-queue/add-track` - Add track to queue

#### AI Assistant
- `POST /api/chatbot/message` - Send message to AI
- `GET /api/chatbot/history` - Chat history

#### Payments
- `POST /api/payments/create-subscription` - Subscribe to plan
- `POST /api/payments/cancel-subscription` - Cancel subscription

## 🎮 WebSocket Events

### Client → Server
- `queue:add_track` - Add track to queue
- `queue:remove_track` - Remove track from queue
- `playback:play_pause` - Toggle playback
- `playback:next` - Skip to next track
- `playback:previous` - Previous track

### Server → Client
- `queue:update` - Queue state changed
- `notification:new` - New notification
- `playback:state_changed` - Playback state update

## 🤖 AI Chatbot Capabilities

The AI music assistant can help with:
- **Music Discovery**: "Recommend some jazz music"
- **Search**: "Find songs by Taylor Swift"
- **Mood-based**: "I'm feeling happy, what should I listen to?"
- **Popular Content**: "Show me trending music"
- **App Help**: "How do I create a playlist?"

## 💳 Payment Features

- Multiple subscription tiers
- Stripe payment processing
- Subscription lifecycle management
- Usage tracking and billing
- Payment method management
- Webhook event handling

## 📊 Analytics Dashboard

Track comprehensive metrics:
- User engagement and retention
- Content performance analytics
- Platform statistics
- Artist-specific insights
- Device and geographic data
- Search and playlist analytics

## 🔧 Development

### Available Scripts

```bash
npm run start:dev     # Development with hot reload
npm run build         # Build for production
npm run test          # Run tests
npm run test:e2e      # End-to-end tests
npm run lint          # ESLint
npm run format        # Prettier formatting
```

### Project Structure

```
src/
├── auth/             # Authentication module
├── users/            # User management
├── tracks/           # Music tracks
├── artists/          # Artist management
├── albums/           # Album collections
├── playlists/        # User playlists
├── genres/           # Music genres
├── favorites/        # User favorites
├── search/           # Advanced search
├── analytics/        # Platform analytics
├── chatbot/          # AI assistant
├── stream-queue/     # Playback queue
├── payments/         # Stripe integration
├── notifications/    # Real-time notifications
├── subscription-plans/ # Subscription management
├── schemas/          # MongoDB schemas
├── common/           # Shared utilities
└── main.ts          # Application entry point
```

## 🌐 WebSocket Integration

Real-time features powered by Socket.IO:
- Live queue synchronization across devices
- Instant notifications
- Real-time playback state sharing
- Live user presence

## 📧 Email Templates

Pre-built email templates for:
- Welcome emails
- Password reset
- Subscription confirmations
- Playlist sharing notifications
- New release alerts

## 🔒 Security Features

- JWT authentication with refresh tokens
- Input validation and sanitization
- Rate limiting and throttling
- CORS configuration
- File upload security
- Webhook signature verification

## 🚦 Environment Variables

See `env.example` for all available configuration options including:
- Database connections
- Email service configuration
- Payment gateway settings
- File storage options
- Security settings

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎵 Ready to Rock!

Your Harmonia backend is now ready to power an amazing music streaming experience! 🎸
