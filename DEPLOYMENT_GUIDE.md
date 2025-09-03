# 🚀 Руководство по деплою Aurelo.dev

## 📋 Подготовка к деплою

### ✅ Что уже готово:
- [x] Stripe интеграция настроена
- [x] Все функции созданы
- [x] URL обновлены для aurelo.dev
- [x] Конфигурация Netlify готова
- [x] Зависимости добавлены

### 🔧 Быстрая проверка:
```bash
# Перейти в папку проекта
cd project

# Запустить проверку
chmod +x quick-deploy.sh
./quick-deploy.sh
```

## 🚀 Процесс деплоя

### 1. Загрузка на GitHub
```bash
# Инициализация git (если нужно)
git init

# Добавление всех файлов
git add .

# Коммит
git commit -m "🚀 Подготовка к деплою с Stripe интеграцией"

# Добавление удаленного репозитория
git remote add origin https://github.com/your-username/your-repo.git

# Пуш
git push -u origin main
```

### 2. Настройка Netlify

1. **Войти в Netlify Dashboard**
2. **Нажать "New site from Git"**
3. **Выбрать GitHub и ваш репозиторий**
4. **Настроить параметры сборки:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### 3. Настройка домена

1. **В настройках сайта перейти в "Domain settings"**
2. **Добавить кастомный домен: `aurelo.dev`**
3. **Настроить DNS записи (если нужно)**
4. **Дождаться активации SSL сертификата**

### 4. Проверка функций

После деплоя проверить:
- `https://aurelo.dev/.netlify/functions/stripe-create-checkout-session`
- `https://aurelo.dev/.netlify/functions/stripe-create-portal-session`
- `https://aurelo.dev/.netlify/functions/stripe-webhook`

## 🔗 Настройка Stripe

### Webhook URL
В Stripe Dashboard установить:
```
https://aurelo.dev/api/stripe/webhook
```

### События для webhook:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🧪 Тестирование

### 1. Проверка страниц
- [ ] `https://aurelo.dev/pricing` - страница с планами
- [ ] `https://aurelo.dev/success` - страница успеха
- [ ] `https://aurelo.dev/cancel` - страница отмены

### 2. Тестирование оплаты
1. Перейти на `/pricing`
2. Выбрать план
3. Заполнить тестовую карту: `4242 4242 4242 4242`
4. Проверить перенаправление на `/success`

### 3. Проверка webhook
1. Создать тестовую подписку
2. Проверить логи в Netlify Functions
3. Убедиться, что события приходят

## 🐛 Решение проблем

### CORS ошибки
```bash
# Проверить заголовки в netlify.toml
# Убедиться в правильности домена
```

### Функции не работают
1. Проверить логи в Netlify Functions
2. Убедиться в правильности редиректов
3. Проверить Node.js версию

### Webhook не работает
1. Проверить URL в Stripe Dashboard
2. Убедиться в правильности подписи
3. Проверить SSL сертификат

## 📊 Мониторинг

### Логи Netlify Functions
- Перейти в Netlify Dashboard
- Выбрать сайт
- Перейти в "Functions"
- Просмотреть логи

### Stripe Dashboard
- Проверить события webhook
- Просмотреть созданные подписки
- Проверить платежи

## 🎉 Готово!

После прохождения всех проверок система готова к приему реальных платежей!

### 🔗 Полезные ссылки:
- **Netlify Dashboard**: https://app.netlify.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Документация Stripe**: https://stripe.com/docs

### 📞 Поддержка:
При возникновении проблем проверьте:
1. Логи в Netlify Functions
2. События в Stripe Dashboard
3. Настройки DNS и SSL

**Удачи с деплоем! 🚀✨**
