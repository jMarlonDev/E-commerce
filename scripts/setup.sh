#!/bin/bash
# ============================================
# E-Commerce Project Setup Script
# ============================================

set -e

echo "========================================="
echo "  E-Commerce Project Setup"
echo "========================================="

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found. Installing..."
    npm install -g pnpm
fi

echo ""
echo "[1/5] Installing dependencies..."
pnpm install

echo ""
echo "[2/5] Creating .env files..."
if [ ! -f packages/frontend/.env ]; then
    cp packages/frontend/.env.example packages/frontend/.env
    echo "  Created packages/frontend/.env"
fi

if [ ! -f packages/backend/.env ]; then
    cp packages/backend/.env.example packages/backend/.env
    echo "  Created packages/backend/.env"
fi

echo ""
echo "[3/5] Setup complete!"
echo ""
echo "========================================="
echo "  Next Steps:"
echo "========================================="
echo ""
echo "1. Configure your .env files:"
echo "   - packages/frontend/.env"
echo "   - packages/backend/.env"
echo ""
echo "2. Set up Supabase:"
echo "   - Create a project at https://supabase.com"
echo "   - Run the SQL schema in the SQL Editor"
echo "   - Copy the URL and keys to .env"
echo ""
echo "3. Set up Google OAuth:"
echo "   - Go to https://console.cloud.google.com"
echo "   - Create OAuth 2.0 credentials"
echo "   - Add authorized redirect URIs"
echo ""
echo "4. Start development:"
echo "   pnpm dev:all"
echo ""
