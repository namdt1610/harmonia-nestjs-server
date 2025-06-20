#!/bin/bash

# MongoDB to PostgreSQL Migration Setup Script for Harmonia

echo "🚀 Starting MongoDB to PostgreSQL migration setup..."

# Navigate to the server directory
cd "$(dirname "$0")"

echo "📦 Installing new dependencies..."
npm install @prisma/client prisma @types/pg pg

echo "🗑️ Removing old MongoDB dependencies..."
npm uninstall @nestjs/mongoose mongoose

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📝 Creating initial migration..."
# Note: Make sure PostgreSQL is running and DATABASE_URL is set in .env
# npx prisma migrate dev --name init

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database"
echo "2. Update your .env file with DATABASE_URL"
echo "3. Run: npx prisma migrate dev --name init"
echo "4. Run: npx prisma db seed (if seed file exists)"
echo ""
echo "🔧 Useful Prisma commands:"
echo "- npx prisma studio (Database GUI)"
echo "- npx prisma migrate dev (Create and apply migration)"
echo "- npx prisma db push (Push schema without migration)"
echo "- npx prisma generate (Regenerate client)" 