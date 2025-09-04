#!/bin/bash

echo "🔍 Проверка готовности к деплою на Netlify..."

# Проверка наличия ключевых файлов
echo "📁 Проверка файлов..."

files=(
  "package.json"
  "netlify.toml"
  "vite.config.ts"
  "public/_redirects"
  "netlify/functions/video-analysis.js"
  "netlify/functions/youtube-oauth.js"
  "netlify/functions/stripe-create-checkout-session.js"
  "netlify/functions/stripe-webhook.js"
  "netlify/functions/stripe-create-portal-session.js"
  "netlify/functions/youtube-upload.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - ОТСУТСТВУЕТ!"
  fi
done

# Проверка зависимостей
echo ""
echo "📦 Проверка зависимостей..."

required_deps=(
  "ffmpeg-static"
  "fluent-ffmpeg"
  "multer"
  "uuid"
  "node-cache"
  "openai"
  "googleapis"
  "stripe"
)

for dep in "${required_deps[@]}"; do
  if grep -q "\"$dep\"" package.json; then
    echo "✅ $dep"
  else
    echo "❌ $dep - ОТСУТСТВУЕТ в package.json!"
  fi
done

# Проверка переменных окружения
echo ""
echo "🔧 Проверка переменных окружения..."

env_vars=(
  "YOUTUBE_CLIENT_ID"
  "YOUTUBE_CLIENT_SECRET"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "OPENAI_API_KEY"
  "VITE_STRIPE_PUBLISHABLE_KEY"
)

for var in "${env_vars[@]}"; do
  if grep -q "$var" env.example; then
    echo "✅ $var"
  else
    echo "❌ $var - ОТСУТСТВУЕТ в env.example!"
  fi
done

# Проверка синтаксиса функций
echo ""
echo "🔍 Проверка синтаксиса функций..."

functions=(
  "netlify/functions/video-analysis.js"
  "netlify/functions/youtube-oauth.js"
  "netlify/functions/stripe-create-checkout-session.js"
  "netlify/functions/stripe-webhook.js"
  "netlify/functions/stripe-create-portal-session.js"
  "netlify/functions/youtube-upload.js"
)

for func in "${functions[@]}"; do
  if node -c "$func" 2>/dev/null; then
    echo "✅ $func - синтаксис корректен"
  else
    echo "❌ $func - ошибка синтаксиса!"
  fi
done

# Проверка сборки
echo ""
echo "🏗️ Проверка сборки..."

if npm run build >/dev/null 2>&1; then
  echo "✅ Сборка прошла успешно"
else
  echo "❌ Ошибка сборки!"
  echo "Запустите 'npm run build' для деталей"
fi

echo ""
echo "🎯 Рекомендации для деплоя:"
echo "1. Убедитесь, что все переменные окружения настроены в Netlify"
echo "2. Проверьте настройки YouTube API в Google Cloud Console"
echo "3. Настройте Stripe webhook URL"
echo "4. Убедитесь, что у вас есть доступ к OpenAI API"
echo ""
echo "📚 Подробные инструкции: DEPLOYMENT_GUIDE.md"
echo "�� Готово к деплою!"
