# 📋 ПОЛНОЕ РУКОВОДСТВО ПО НАСТРОЙКЕ NETLIFY

## 🚀 ШАГ 1: ПОДКЛЮЧЕНИЕ РЕПОЗИТОРИЯ

### 1. Войдите в Netlify Dashboard
- Перейдите на https://app.netlify.com
- Войдите в свой аккаунт

### 2. Создайте новый сайт
- Нажмите **"New site from Git"**
- Выберите **GitHub** как провайдер
- Выберите ваш репозиторий `video-analysis-app`

### 3. Настройте параметры сборки
```
Build command: npm run build
Publish directory: dist
Base directory: (оставьте пустым)
```

## ⚙️ ШАГ 2: НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ

### Перейдите в Site settings → Environment variables

#### 🔑 Обязательные переменные:

**Stripe:**
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**OpenAI:**
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Frontend переменные (VITE_*):**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_APP_URL=https://your-app-name.netlify.app
VITE_STRIPE_MODE=test
VITE_STRIPE_PRICE_BEGINNER=price_your_beginner_plan_id
VITE_STRIPE_PRICE_PRO=price_your_pro_plan_id
VITE_STRIPE_PRICE_MAX=price_your_max_plan_id
VITE_STRIPE_PRICE_MAX_YEARLY=price_your_max_yearly_plan_id
VITE_STRIPE_PRICE_PRO_YEARLY=price_your_pro_yearly_plan_id
```

**Системные переменные:**
```
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

## 🔧 ШАГ 3: НАСТРОЙКА BUILD SETTINGS

### Перейдите в Site settings → Build & deploy → Build settings

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `18`

**Deploy settings:**
- Auto deploy: `Enabled`
- Branch to deploy: `main` (или ваша основная ветка)

## 🌐 ШАГ 4: НАСТРОЙКА ДОМЕНА

### Перейдите в Site settings → Domain management

**Вариант 1: Использовать Netlify домен**
- Оставьте автоматически сгенерированный домен
- Или настройте кастомный поддомен

**Вариант 2: Подключить кастомный домен**
- Добавьте ваш домен
- Настройте DNS записи
- Дождитесь активации SSL сертификата

## 🔗 ШАГ 5: НАСТРОЙКА API КЛЮЧЕЙ

### Stripe Dashboard
1. Перейдите в https://dashboard.stripe.com
2. Создайте **Webhook endpoint**
3. URL webhook: `https://your-app-name.netlify.app/.netlify/functions/stripe-webhook`
4. События для webhook:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### OpenAI API
1. Перейдите в https://platform.openai.com
2. Создайте API ключ
3. Убедитесь, что у вас есть доступ к GPT-4 Vision

## 📊 ШАГ 6: ПРОВЕРКА ФУНКЦИЙ

### После деплоя проверьте функции Netlify:

**Тестовые URL:**
```
https://your-app-name.netlify.app/.netlify/functions/stripe-create-checkout-session
https://your-app-name.netlify.app/.netlify/functions/stripe-webhook
https://your-app-name.netlify.app/.netlify/functions/video-analysis
```

**API endpoints:**
```
https://your-app-name.netlify.app/api/stripe
https://your-app-name.netlify.app/api/video-analysis
```

## 🔍 ШАГ 7: МОНИТОРИНГ И ЛОГИ

### Перейдите в Functions → Logs
- Проверьте логи функций
- Убедитесь, что нет ошибок

### Перейдите в Analytics
- Отслеживайте трафик
- Мониторьте производительность

## 🧪 ШАГ 8: ТЕСТИРОВАНИЕ

### Тестирование основных функций:

1. **Главная страница**
   - Откройте ваш сайт
   - Убедитесь, что все компоненты загружаются

2. **Stripe платежи**
   - Протестируйте создание checkout session
   - Используйте тестовые карты Stripe

3. **Анализ видео**
   - Загрузите тестовое видео
   - Проверьте работу AI анализа

## ⚠️ ШАГ 9: БЕЗОПАСНОСТЬ

### Проверьте настройки безопасности:

1. **Environment variables**
   - Убедитесь, что секретные ключи не видны в коде
   - Проверьте, что все переменные установлены

2. **CORS настройки**
   - Проверьте, что функции возвращают правильные CORS заголовки
   - Убедитесь, что домены правильно настроены

3. **SSL сертификат**
   - Дождитесь активации SSL сертификата
   - Проверьте, что сайт работает по HTTPS

## 📱 ШАГ 10: ФИНАЛЬНАЯ ПРОВЕРКА

### Чек-лист готовности:

- ✅ Репозиторий подключен к Netlify
- ✅ Все переменные окружения настроены
- ✅ Build settings корректны
- ✅ Домен настроен
- ✅ API ключи получены и настроены
- ✅ Webhook URL настроен в Stripe
- ✅ OpenAI API настроен
- ✅ Функции Netlify работают
- ✅ SSL сертификат активен
- ✅ Тестирование пройдено

## 🚀 ГОТОВО!

После выполнения всех шагов ваш проект будет полностью готов к работе на Netlify!

### 🔗 Полезные ссылки:
- **Netlify Dashboard**: https://app.netlify.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **OpenAI Platform**: https://platform.openai.com

### 📞 Поддержка:
При возникновении проблем проверьте:
1. Логи в Netlify Functions
2. Переменные окружения
3. Настройки API ключей
4. CORS заголовки

**Удачи с деплоем! 🎉**
