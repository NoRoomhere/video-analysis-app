# Инструкции по развертыванию

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Скопируйте файл `env.example` в `.env` и заполните необходимые переменные:

```bash
cp env.example .env
```

Заполните следующие переменные:
- `VITE_FIREBASE_*` - настройки Firebase
- `VITE_YOUTUBE_CLIENT_ID` - ID клиента YouTube API
- `VITE_YOUTUBE_CLIENT_SECRET` - секрет клиента YouTube API

### 3. Запуск в режиме разработки
```bash
npm run dev
```

### 4. Сборка для продакшена
```bash
npm run build
```

## 🔧 Настройка YouTube API

### 1. Создание проекта в Google Cloud Console
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите YouTube Data API v3

### 2. Создание OAuth 2.0 клиента
1. Перейдите в "APIs & Services" > "Credentials"
2. Нажмите "Create Credentials" > "OAuth 2.0 Client IDs"
3. Выберите тип приложения "Web application"
4. Добавьте разрешенные URI перенаправления:
   - `http://localhost:5173/auth/youtube/callback` (для разработки)
   - `https://your-domain.com/auth/youtube/callback` (для продакшена)

### 3. Получение учетных данных
Скопируйте Client ID и Client Secret в файл `.env`

## 🔥 Настройка Firebase

### 1. Создание проекта Firebase
1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект
3. Включите Authentication с Email/Password

### 2. Получение конфигурации
1. Перейдите в Project Settings
2. Скопируйте конфигурацию в файл `.env`

## 🌐 Развертывание на Netlify

### 1. Подготовка к развертыванию
```bash
npm run build
```

### 2. Настройка Netlify
1. Создайте новый сайт на Netlify
2. Подключите ваш Git репозиторий
3. Настройте переменные окружения в Netlify Dashboard

### 3. Настройка функций Netlify
Функции для YouTube OAuth уже настроены в папке `netlify/functions/`

### 4. Настройка редиректов
Файл `public/_redirects` уже настроен для правильной работы роутинга

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── layout/         # Компоненты макета
│   ├── features/       # Функциональные компоненты
│   ├── auth/           # Компоненты аутентификации
│   └── youtube/        # YouTube интеграция
├── context/            # React Context
├── hooks/              # Кастомные хуки
├── services/           # API сервисы
├── utils/              # Утилиты и константы
├── types/              # TypeScript типы
├── pages/              # Страницы приложения
└── assets/             # Статические ресурсы
```

## 🔍 Проверка работоспособности

### 1. Проверка аутентификации
- Регистрация/вход через Firebase
- Проверка защищенных маршрутов

### 2. Проверка YouTube интеграции
- Подключение YouTube аккаунта
- Загрузка видео
- Просмотр статистики

### 3. Проверка всех функций
- Dashboard
- Video Analysis
- Social Automation
- Competitor Analysis
- Trends & News
- AI Chat

## 🐛 Устранение неполадок

### Проблемы с YouTube API
- Проверьте правильность Client ID и Secret
- Убедитесь, что YouTube Data API v3 включен
- Проверьте разрешенные URI перенаправления

### Проблемы с Firebase
- Проверьте конфигурацию Firebase
- Убедитесь, что Authentication включен
- Проверьте правила безопасности

### Проблемы с развертыванием
- Проверьте переменные окружения в Netlify
- Убедитесь, что функции Netlify работают
- Проверьте логи в Netlify Dashboard

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Проверьте логи в Netlify Dashboard
3. Создайте issue в репозитории проекта 