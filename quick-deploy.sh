#!/bin/bash

echo "🚀 Быстрый деплой Aurelo.dev с Stripe интеграцией"

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ Node.js и npm найдены"

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

# Проверка Stripe зависимостей
echo "🔍 Проверка Stripe зависимостей..."
if npm list @stripe/stripe-js &> /dev/null && npm list stripe &> /dev/null; then
    echo "✅ Stripe зависимости установлены"
else
    echo "📦 Установка Stripe зависимостей..."
    npm install @stripe/stripe-js stripe
fi

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Сборка завершена успешно"
else
    echo "❌ Ошибка сборки"
    exit 1
fi

# Проверка файлов
echo "🔍 Проверка критических файлов..."

# Проверка netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml найден"
else
    echo "❌ netlify.toml не найден"
    exit 1
fi

# Проверка функций
if [ -d "netlify/functions" ]; then
    echo "✅ Netlify функции найдены"
else
    echo "❌ Netlify функции не найдены"
    exit 1
fi

# Проверка конфигурации Stripe
if [ -f "src/config/stripe.ts" ]; then
    echo "✅ Конфигурация Stripe найдена"
else
    echo "❌ Конфигурация Stripe не найдена"
    exit 1
fi

echo ""
echo "🎉 Проект готов к деплою!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Загрузите код на GitHub"
echo "2. Подключите репозиторий к Netlify"
echo "3. Настройте домен aurelo.dev"
echo "4. Проверьте webhook URL в Stripe Dashboard"
echo ""
echo "🔗 Webhook URL: https://aurelo.dev/api/stripe/webhook"
echo ""
echo "✅ Готово к деплою!"
