#!/bin/bash
# ============================================
# Database Reset Script
# ============================================

set -e

echo "WARNING: This will reset the database!"
read -p "Are you sure? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run the schema.sql file manually in the Supabase SQL Editor"
    echo "File: packages/backend/src/database/schema.sql"
    echo ""
    echo "Then run seeds.sql to populate with sample data"
else
    echo "Cancelled."
fi
