# 🚀 Ручной деплой Aurelo.dev на Netlify

## 📦 Подготовка файлов

### 1. Создание архива для деплоя
```bash
# Перейти в папку проекта
cd project

# Установить зависимости
npm install

# Собрать проект
npm run build

# Создать архив для деплоя
zip -r aurelo-deploy.zip . -x "node_modules/*" ".git/*" "*.log"
```

### 2. Структура архива
```
aurelo-deploy.zip
├── dist/                    # Собранные файлы
├── netlify/
│   └── functions/          # Stripe функции
├── netlify.toml            # Конфигурация Netlify
├── package.json            # Зависимости
└── README.md
```

## 🌐 Деплой на Netlify

### 1. Войти в Netlify Dashboard
- Перейти на https://app.netlify.com
- Войти в аккаунт

### 2. Создать новый сайт
- Нажать **"New site from Git"**
- Выбрать **"Deploy manually"**
- Перетащить архив `aurelo-deploy.zip`

### 3. Настройка параметров
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### 4. Настройка домена
- Перейти в **"Domain settings"**
- Добавить кастомный домен: `aurelo.dev`
- Настроить DNS записи (если нужно)
- Дождаться активации SSL

## 🔧 Проверка функций

После деплоя проверить:
- `https://aurelo.dev/.netlify/functions/stripe-create-checkout-session`
- `https://aurelo.dev/.netlify/functions/stripe-create-portal-session`
- `https://aurelo.dev/.netlify/functions/stripe-webhook`

## 🧪 Тестирование

### 1. Проверка страниц
- `https://aurelo.dev/pricing` - планы подписки
- `https://aurelo.dev/success` - успешная оплата
- `https://aurelo.dev/cancel` - отмена оплаты

### 2. Тестирование оплаты
1. Перейти на `/pricing`
2. Выбрать план
3. Заполнить тестовую карту: `4242 4242 4242 4242`
4. Проверить перенаправление на `/success`

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

## 🎉 Готово!

После прохождения всех проверок система готова к приему реальных платежей!
