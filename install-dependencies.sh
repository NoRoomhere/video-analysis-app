#!/bin/bash

echo "🚀 Установка зависимостей для Aurelo.dev..."

# Установка основных зависимостей
npm install

# Установка Stripe зависимостей
npm install @stripe/stripe-js stripe

# Проверка установки
echo "✅ Зависимости установлены!"
echo "📦 Версии пакетов:"
npm list @stripe/stripe-js stripe --depth=0

echo "�� Готово к деплою!"
