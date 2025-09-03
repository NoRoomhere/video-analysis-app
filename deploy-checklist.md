# 🚀 Чек-лист деплоя Aurelo.dev

## ✅ Перед деплоем

### 1. Проверка файлов
- [ ] Все Stripe функции созданы в `netlify/functions/`
- [ ] Конфигурация Stripe обновлена в `src/config/stripe.ts`
- [ ] URL обновлены для домена `aurelo.dev`
- [ ] `netlify.toml` настроен правильно

### 2. Проверка зависимостей
- [ ] `@stripe/stripe-js` установлен
- [ ] `stripe` установлен
- [ ] Все остальные зависимости установлены

### 3. Проверка Stripe Dashboard
- [ ] Webhook URL: `https://aurelo.dev/api/stripe/webhook`
- [ ] Все Price IDs созданы и активны
- [ ] Продакшн ключи настроены

## 🔧 Процесс деплоя

### 1. Загрузка на GitHub
```bash
git add .
git commit -m "🚀 Подготовка к деплою с Stripe интеграцией"
git push origin main
```

### 2. Настройка Netlify
- Подключить репозиторий к Netlify
- Установить домен: `aurelo.dev`
- Настроить SSL сертификат

### 3. Переменные окружения (если нужны)
- `STRIPE_PUBLISHABLE_KEY`: `pk_live_51QAxGBDAPgaxve67jKx7IGMBzL5Z8i5VbUgiF5xOpXMaJuveISxk7Rje1CUlyJJLquYWKHpCoeucE3GGLa3mvODs007hdAPyhD`
- `STRIPE_SECRET_KEY`: `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`

## 🧪 После деплоя

### 1. Проверка функций
- [ ] `/api/stripe/create-checkout-session` работает
- [ ] `/api/stripe/create-portal-session` работает
- [ ] `/api/stripe/webhook` принимает события

### 2. Проверка страниц
- [ ] `/pricing` отображается корректно
- [ ] `/success` работает после оплаты
- [ ] `/cancel` работает при отмене

### 3. Тестирование оплаты
- [ ] Создание Checkout Session
- [ ] Перенаправление на Stripe
- [ ] Обработка успешной оплаты
- [ ] Обработка отмены

### 4. Проверка webhook
- [ ] События приходят в функции
- [ ] Логи отображаются в Netlify
- [ ] Подписки создаются в Stripe

## 🐛 Возможные проблемы

### CORS ошибки
- Проверить заголовки в `netlify.toml`
- Убедиться в правильности домена

### Функции не работают
- Проверить логи в Netlify Functions
- Убедиться в правильности редиректов

### Webhook не работает
- Проверить URL в Stripe Dashboard
- Убедиться в правильности подписи

## 🎉 Готово!

После прохождения всех проверок система готова к приему реальных платежей! 💳✨
