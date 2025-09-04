# PowerShell скрипт для проверки готовности к деплою на Netlify

Write-Host "🔍 Проверка готовности к деплою на Netlify..." -ForegroundColor Green

# Проверка наличия ключевых файлов
Write-Host "📁 Проверка файлов..." -ForegroundColor Yellow

$files = @(
  "package.json",
  "netlify.toml",
  "vite.config.ts",
  "public/_redirects",
  "netlify/functions/video-analysis.js",
  "netlify/functions/youtube-oauth.js",
  "netlify/functions/stripe-create-checkout-session.js",
  "netlify/functions/stripe-webhook.js",
  "netlify/functions/stripe-create-portal-session.js",
  "netlify/functions/youtube-upload.js"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "✅ $file" -ForegroundColor Green
  } else {
    Write-Host "❌ $file - ОТСУТСТВУЕТ!" -ForegroundColor Red
  }
}

# Проверка зависимостей
Write-Host ""
Write-Host "📦 Проверка зависимостей..." -ForegroundColor Yellow

$required_deps = @(
  "ffmpeg-static",
  "fluent-ffmpeg",
  "multer",
  "uuid",
  "node-cache",
  "openai",
  "googleapis",
  "stripe"
)

foreach ($dep in $required_deps) {
  if (Select-String -Path "package.json" -Pattern "\"$dep\"" -Quiet) {
    Write-Host "✅ $dep" -ForegroundColor Green
  } else {
    Write-Host "❌ $dep - ОТСУТСТВУЕТ в package.json!" -ForegroundColor Red
  }
}

# Проверка переменных окружения
Write-Host ""
Write-Host "🔧 Проверка переменных окружения..." -ForegroundColor Yellow

$env_vars = @(
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
  "VITE_STRIPE_PUBLISHABLE_KEY"
)

foreach ($var in $env_vars) {
  if (Select-String -Path "env.example" -Pattern $var -Quiet) {
    Write-Host "✅ $var" -ForegroundColor Green
  } else {
    Write-Host "❌ $var - ОТСУТСТВУЕТ в env.example!" -ForegroundColor Red
  }
}

# Проверка синтаксиса функций
Write-Host ""
Write-Host "🔍 Проверка синтаксиса функций..." -ForegroundColor Yellow

$functions = @(
  "netlify/functions/video-analysis.js",
  "netlify/functions/youtube-oauth.js",
  "netlify/functions/stripe-create-checkout-session.js",
  "netlify/functions/stripe-webhook.js",
  "netlify/functions/stripe-create-portal-session.js",
  "netlify/functions/youtube-upload.js"
)

foreach ($func in $functions) {
  try {
    $null = node -c $func 2>$null
    Write-Host "✅ $func - синтаксис корректен" -ForegroundColor Green
  } catch {
    Write-Host "❌ $func - ошибка синтаксиса!" -ForegroundColor Red
  }
}

# Проверка сборки
Write-Host ""
Write-Host "🏗️ Проверка сборки..." -ForegroundColor Yellow

try {
  $null = npm run build 2>$null
  Write-Host "✅ Сборка прошла успешно" -ForegroundColor Green
} catch {
  Write-Host "❌ Ошибка сборки!" -ForegroundColor Red
  Write-Host "Запустите 'npm run build' для деталей" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Рекомендации для деплоя:" -ForegroundColor Cyan
Write-Host "1. Убедитесь, что все переменные окружения настроены в Netlify" -ForegroundColor White
Write-Host "2. Проверьте настройки YouTube API в Google Cloud Console" -ForegroundColor White
Write-Host "3. Настройте Stripe webhook URL" -ForegroundColor White
Write-Host "4. Убедитесь, что у вас есть доступ к OpenAI API" -ForegroundColor White
Write-Host ""
Write-Host "📚 Подробные инструкции: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "🚀 Готово к деплою!" -ForegroundColor Green
