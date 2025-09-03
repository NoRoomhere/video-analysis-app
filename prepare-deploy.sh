#!/bin/bash

echo "🚀 Подготовка архива для ручного деплоя Aurelo.dev"

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

# Очистка предыдущих сборок
echo "🧹 Очистка предыдущих сборок..."
rm -rf dist
rm -f aurelo-deploy.zip

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

# Проверка критических файлов
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

# Проверка dist папки
if [ -d "dist" ]; then
    echo "✅ Папка dist создана"
else
    echo "❌ Папка dist не создана"
    exit 1
fi

# Создание архива
echo "📦 Создание архива для деплоя..."
zip -r aurelo-deploy.zip . -x "node_modules/*" ".git/*" "*.log" "*.sh" "DEPLOY_*.md" "deploy-checklist.md"

if [ $? -eq 0 ]; then
    echo "✅ Архив aurelo-deploy.zip создан"
else
    echo "❌ Ошибка создания архива"
    exit 1
fi

# Проверка размера архива
ARCHIVE_SIZE=$(du -h aurelo-deploy.zip | cut -f1)
echo "📊 Размер архива: $ARCHIVE_SIZE"

echo ""
echo "🎉 Архив готов к деплою!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейти на https://app.netlify.com"
echo "2. Нажать 'New site from Git'"
echo "3. Выбрать 'Deploy manually'"
echo "4. Перетащить файл aurelo-deploy.zip"
echo "5. Настроить домен aurelo.dev"
echo "6. Проверить webhook URL в Stripe Dashboard"
echo ""
echo "🔗 Webhook URL: https://aurelo.dev/api/stripe/webhook"
echo ""
echo "✅ Готово к деплою!"
