#!/bin/bash

# ============================
# Safe Deployment Script for Next.js
# ============================

APP_NAME="tdhv2-site"
APP_DIR="/home/ubuntu/tdhv2-site"
BRANCH="main"
PM2_PROCESS_NAME="tdhv2-site"

# Move to app directory
cd "$APP_DIR" || exit 1

# Pull latest changes
echo "Pulling latest changes from $BRANCH..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app safely
echo "Building the app..."
if npm run build; then
  echo "✅ Build succeeded."
  
  # Restart the app with PM2 and update env
  echo "Restarting PM2 process..."
  pm2 restart "$PM2_PROCESS_NAME" --update-env || pm2 start npm --name "$PM2_PROCESS_NAME" -- start

  # Save PM2 process list (optional)
  pm2 save

  echo "✅ Deployment completed successfully!"
else
  echo "❌ Build failed. Keeping the current build and process running."
  exit 1
fi
