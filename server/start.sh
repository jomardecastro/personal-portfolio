#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database if empty..."
node dist/seed-check.js

echo "Starting server..."
node dist/index.js
