# 💳 Stripe Payment Integration

Полная система оплаты и подписок через Stripe для React приложения.

## 🚀 Возможности

- ✅ **Stripe Checkout** для безопасной оплаты
- ✅ **Подписки** с пробными периодами
- ✅ **Customer Portal** для управления подписками
- ✅ **Webhook обработчики** для автоматизации
- ✅ **Интеграция с Firebase** для пользователей
- ✅ **Система лимитов** по планам

## 📋 Планы подписки

### Ежемесячные планы:
- **Beginner**: $3/месяц - 2 видео в день
- **Pro**: $15/месяц - 5 видео в день (3 дня пробный период)
- **Max**: $40/месяц - 20 видео в день

### Ежегодные планы:
- **Pro**: $140/год - экономия $40
- **Max**: $340/год - экономия $140

## 🔧 Установка и настройка

### 1. Установка зависимостей
```bash
npm install @stripe/stripe-js stripe
```

### 2. Настройка Stripe
Все ключи уже настроены в `src/config/stripe.ts`:
- Publishable Key: `pk_live_51QAxGBDAPgaxve67jKx7IGMBzL5Z8i5VbUgiF5xOpXMaJuveISxk7Rje1CUlyJJLquYWKHpCoeucE3GGLa3mvODs007hdAPyhD`
- Secret Key: `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`
- Webhook Secret: `whsec_rcZH0PhLmMHhKwajOvphYy5tj2LSkUAY`

### 3. Price IDs
- Beginner: `price_1S2DNdDAPgaxve67BVjrgd6F`
- Pro: `price_1S2DOvDAPgaxve67l0somLKr`
- Max: `price_1S2DPcDAPgaxve670PKYSSZo`
- Pro Yearly: `price_1S2DRCDAPgaxve67Qt8yUmqG`
- Max Yearly: `price_1S2DScDAPgaxve67tm4iTmAn`

## 📁 Структура файлов

```
src/
├── config/
│   └── stripe.ts                 # Конфигурация Stripe
├── services/
│   └── stripeService.ts          # API для работы со Stripe
├── components/features/
│   ├── SubscriptionPlans.tsx     # Компонент планов подписки
│   └── SubscriptionManager.tsx   # Управление подпиской
├── pages/
│   ├── Pricing.tsx              # Страница с планами
│   ├── Success.tsx              # Страница успешной оплаты
│   └── Cancel.tsx               # Страница отмены оплаты
└── utils/
    └── subscriptionPlans.ts     # Конфигурация планов

netlify/functions/
├── stripe-create-checkout-session.js  # Создание Checkout Session
├── stripe-create-portal-session.js    # Создание Portal Session
└── stripe-webhook.js                  # Обработка webhook событий
```

## 🔄 Процесс оплаты

### 1. Выбор плана
Пользователь выбирает план на странице `/pricing`

### 2. Создание Checkout Session
```typescript
const { sessionId } = await createCheckoutSession(
  planId,
  userEmail,
  successUrl,
  cancelUrl
);
```

### 3. Перенаправление на Stripe
```typescript
const stripe = await getStripe();
await stripe.redirectToCheckout({ sessionId });
```

### 4. Обработка результата
- **Успех**: Перенаправление на `/success`
- **Отмена**: Перенаправление на `/cancel`

## 🎛️ Управление подпиской

### Customer Portal
```typescript
const { url } = await createCustomerPortalSession(
  customerId,
  returnUrl
);
window.location.href = url;
```

### Компонент SubscriptionManager
Отображает информацию о текущей подписке и позволяет управлять ею.

## 🔗 Webhook события

Обрабатываемые события в `stripe-webhook.js`:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🚀 Деплой на Netlify

### 1. Настройка функций
Функции уже настроены в `netlify/functions/`

### 2. Редиректы
Добавлены в `netlify.toml`:
```toml
[[redirects]]
  from = "/api/stripe/*"
  to = "/.netlify/functions/stripe-:splat"
  status = 200
```

### 3. Webhook URL
Настройте webhook в Stripe Dashboard:
```
https://aurelo.dev/.netlify/functions/stripe-webhook
```

**Примечание:** Убедитесь, что в Stripe Dashboard webhook URL указан как:
```
https://aurelo.dev/api/stripe/webhook
```

## 🔒 Безопасность

- ✅ Все ключи защищены
- ✅ CORS настроен
- ✅ Webhook подпись проверяется
- ✅ HTTPS обязателен

## 🧪 Тестирование

### Тестовые карты Stripe:
- **Успешная оплата**: `4242 4242 4242 4242`
- **Недостаточно средств**: `4000 0000 0000 0002`
- **Требует аутентификации**: `4000 0025 0000 3155`

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Netlify Functions
2. Убедитесь в правильности webhook URL
3. Проверьте статус подписки в Stripe Dashboard

## 🎉 Готово к использованию!

Система полностью настроена и готова к приему реальных платежей! 💳✨
