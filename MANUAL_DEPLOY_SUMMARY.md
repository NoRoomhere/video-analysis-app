# 🚀 Сводка: Ручной деплой Aurelo.dev

## 📋 Что нужно сделать

### 1. Подготовка файлов
```bash
# В папке project
npm install
npm run build
```

### 2. Создание архива
**Windows:**
- Правый клик на папке `project`
- "Отправить" → "Сжатая zip-папка"
- Переименовать в `aurelo-deploy.zip`

**Linux/Mac:**
```bash
zip -r aurelo-deploy.zip . -x "node_modules/*" ".git/*" "*.log"
```

### 3. Деплой на Netlify
1. Перейти на https://app.netlify.com
2. "New site from Git" → "Deploy manually"
3. Перетащить `aurelo-deploy.zip`
4. Настроить:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### 4. Настройка домена
1. "Domain settings"
2. Добавить: `aurelo.dev`
3. Дождаться SSL

### 5. Настройка Stripe
1. Stripe Dashboard → Webhooks
2. URL: `https://aurelo.dev/api/stripe/webhook`
3. События: все основные

## ✅ Проверка после деплоя

### Функции работают:
- ✅ `/api/stripe/create-checkout-session`
- ✅ `/api/stripe/create-portal-session`
- ✅ `/api/stripe/webhook`

### Страницы работают:
- ✅ `/pricing` - планы подписки
- ✅ `/success` - успешная оплата
- ✅ `/cancel` - отмена оплаты

### Тестирование:
1. Перейти на `/pricing`
2. Выбрать план
3. Карта: `4242 4242 4242 4242`
4. Проверить `/success`

## 🎉 Готово!

Система готова к приему реальных платежей! 💳✨
