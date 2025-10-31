#!/bin/bash

# 배포 환경 설정 스크립트

ENV=${1:-development}

echo "🚀 Setting up environment for: $ENV"

if [ "$ENV" = "production" ]; then
    echo "📦 Copying production environment variables..."
    cp .env.prod .env
    echo "✅ Production environment configured"
elif [ "$ENV" = "development" ]; then
    echo "🔧 Using development environment..."
    if [ ! -f .env.local ]; then
        cp .env.local.example .env.local
        echo "⚠️  Please update .env.local with your actual values"
    fi
    echo "✅ Development environment ready"
else
    echo "❌ Unknown environment: $ENV"
    echo "Usage: ./scripts/setup-env.sh [development|production]"
    exit 1
fi

echo "🎯 Environment setup complete!"
