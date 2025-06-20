# 🚀 MongoDB to PostgreSQL Migration Guide

This guide will help you migrate your Harmonia project from MongoDB to PostgreSQL using Prisma.

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- Docker & Docker Compose (optional)

## 🔧 Step 1: Install Dependencies

Run the migration setup script:

```bash
chmod +x migration-setup.sh
./migration-setup.sh
```

Or manually:

```bash
# Install new dependencies
npm install @prisma/client prisma @types/pg pg

# Remove old MongoDB dependencies
npm uninstall @nestjs/mongoose mongoose

# Generate Prisma client
npx prisma generate
```

## 🐘 Step 2: Set Up PostgreSQL

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker-compose -f docker-compose.postgres.yml up -d

# This will start:
# - PostgreSQL on port 5432
# - Redis on port 6379  
# - PgAdmin on port 8080 (admin@harmonia.local / admin123)
```

### Option B: Local PostgreSQL Installation

1. Install PostgreSQL locally
2. Create a database named `harmonia`
3. Create a user with appropriate permissions

## ⚙️ Step 3: Configure Environment

Update your `.env` file:

```env
# Replace MongoDB configuration with PostgreSQL
DATABASE_URL="postgresql://harmonia_user:harmonia_password@localhost:5432/harmonia?schema=public"

# Or for local installation:
# DATABASE_URL="postgresql://username:password@localhost:5432/harmonia?schema=public"

# Remove these MongoDB variables:
# MONGODB_URI=...
```

## 🗄️ Step 4: Run Database Migration

```bash
# Create and apply the initial migration
npx prisma migrate dev --name init

# Generate Prisma client (if not done already)
npx prisma generate

# Seed the database with sample data
npm run db:seed
```

## 🔄 Step 5: Update Your Modules

### Replace MongoDB Imports

The following modules need updates to remove MongoDB dependencies:

```bash
# Files that need updating:
- src/users/users.module.ts
- src/tracks/tracks.module.ts
- src/artists/artists.module.ts
- src/albums/albums.module.ts
- src/playlists/playlists.module.ts
- src/genres/genres.module.ts
- src/favorites/favorites.module.ts
- src/subscription-plans/subscription-plans.module.ts
- src/analytics/analytics.module.ts
```

Replace MongoDB imports:
```typescript
// Remove these imports:
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

// Replace with:
import { PrismaModule } from '../common/prisma.module';
```

### Update Module Registration

Replace:
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // ...
})
```

With:
```typescript
@Module({
  imports: [PrismaModule],
  // ...
})
```

## 📊 Step 6: Update Repositories

All repositories need to be updated to use Prisma instead of Mongoose. The `stream-queue.repository.ts` has already been converted as an example.

### Key Changes:

1. **Replace Mongoose Model with PrismaService**:
   ```typescript
   // Old (MongoDB)
   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
   
   // New (PostgreSQL)
   constructor(private readonly prisma: PrismaService) {}
   ```

2. **Update Query Syntax**:
   ```typescript
   // Old (MongoDB)
   await this.userModel.findById(id);
   
   // New (PostgreSQL)
   await this.prisma.user.findUnique({ where: { id } });
   ```

3. **Handle Relationships**:
   ```typescript
   // Old (MongoDB)
   .populate('tracks')
   
   // New (PostgreSQL)
   include: { tracks: true }
   ```

## 🧪 Step 7: Update DTOs and Entities

- Replace `Types.ObjectId` with `string`
- Remove MongoDB-specific transforms
- Update validation decorators

## 🔍 Step 8: Testing

```bash
# Run tests to ensure everything works
npm test

# Start the application
npm run start:dev
```

## 🛠️ Useful Prisma Commands

```bash
# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate

# Push schema changes without migration
npx prisma db push
```

## 📈 Performance Benefits

PostgreSQL offers several advantages over MongoDB for this use case:

- **Better Complex Queries**: JOIN operations, subqueries, window functions
- **ACID Transactions**: Full consistency guarantees
- **Mature Ecosystem**: Extensive tooling and extensions
- **Better Full-Text Search**: Built-in search capabilities
- **JSON Support**: Best of both worlds with JSONB columns
- **Scalability**: Proven horizontal and vertical scaling

## 🔧 Troubleshooting

### Common Issues:

1. **Connection Issues**:
   ```bash
   # Check if PostgreSQL is running
   docker ps | grep postgres
   
   # Check connection
   npx prisma db pull
   ```

2. **Migration Errors**:
   ```bash
   # Reset and retry
   npx prisma migrate reset
   npx prisma migrate dev --name init
   ```

3. **Client Generation Issues**:
   ```bash
   # Clean and regenerate
   rm -rf node_modules/@prisma/client
   npx prisma generate
   ```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)

## ✅ Migration Checklist

- [ ] Install PostgreSQL and dependencies
- [ ] Configure environment variables
- [ ] Run initial migration
- [ ] Update app.module.ts
- [ ] Convert all repositories
- [ ] Update DTOs and entities
- [ ] Update all modules
- [ ] Run tests
- [ ] Seed database
- [ ] Test application functionality

---

🎉 **Congratulations!** You've successfully migrated from MongoDB to PostgreSQL!

Your Harmonia application now benefits from PostgreSQL's robust features, better performance for complex queries, and enterprise-grade reliability. 