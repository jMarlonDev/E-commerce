#!/bin/bash
# ============================================
# Database Seeding Script
# ============================================

set -e

echo "Seeding database..."

if [ -f packages/backend/.env ]; then
    source packages/backend/.env
    echo "Running seeds.sql against Supabase..."
    echo "Please run the seeds.sql file manually in the Supabase SQL Editor"
    echo "File: packages/backend/src/database/seeds.sql"
else
    echo "Error: .env file not found in packages/backend/"
    echo "Please run setup.sh first"
    exit 1
fi
