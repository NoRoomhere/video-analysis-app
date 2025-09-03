# Структура проекта

## 📁 Общая структура

```
project/
├── src/                    # Исходный код
├── public/                 # Публичные файлы
├── netlify/                # Функции Netlify
├── package.json            # Зависимости и скрипты
├── vite.config.ts          # Конфигурация Vite
├── tailwind.config.js      # Конфигурация Tailwind CSS
├── tsconfig.json           # Конфигурация TypeScript
├── eslint.config.js        # Конфигурация ESLint
├── .gitignore              # Игнорируемые файлы
├── env.example             # Пример переменных окружения
├── README.md               # Основная документация
├── DEPLOYMENT.md           # Инструкции по развертыванию
└── PROJECT_STRUCTURE.md    # Этот файл
```

## 📁 Структура src/

### 🧩 components/
Компоненты React, организованные по функциональности:

```
components/
├── layout/                 # Компоненты макета
│   ├── Navbar.tsx         # Навигационная панель
│   ├── Footer.tsx         # Подвал сайта
│   ├── Hero.tsx           # Главный баннер
│   ├── LandingHeader.tsx  # Заголовок лендинга
│   └── index.ts           # Экспорт компонентов
├── features/              # Функциональные компоненты
│   ├── Dashboard.tsx      # Главная панель
│   ├── VideoAnalysis.tsx  # Анализ видео
│   ├── SocialAutomation.tsx # Автоматизация соцсетей
│   ├── CompetitorAnalysis.tsx # Анализ конкурентов
│   ├── TrendsNews.tsx     # Тренды и новости
│   ├── AIChat.tsx         # ИИ чат
│   ├── Features.tsx       # Список функций
│   ├── StatsSection.tsx   # Статистика
│   └── index.ts           # Экспорт компонентов
├── auth/                  # Компоненты аутентификации
│   ├── Auth.tsx           # Форма входа/регистрации
│   ├── AccountInfo.tsx    # Информация об аккаунте
│   ├── Policies.tsx       # Политики и условия
│   └── index.ts           # Экспорт компонентов
├── youtube/               # YouTube интеграция
│   ├── YouTubeIntegration.tsx # Основная интеграция
│   ├── YouTubeCallback.tsx    # OAuth callback
│   ├── YouTubeConnect.tsx     # Подключение аккаунта
│   ├── YouTubeUpload.tsx      # Загрузка видео
│   ├── YouTubeStats.tsx       # Статистика YouTube
│   ├── YouTubeHistory.tsx     # История видео
│   ├── YouTubeQuickAccess.tsx # Быстрый доступ
│   └── index.ts               # Экспорт компонентов
└── index.ts               # Главный экспорт всех компонентов
```

### 🔄 context/
React Context для управления состоянием:

```
context/
├── AuthContext.tsx        # Контекст аутентификации
└── index.ts              # Экспорт контекстов
```

### 🎣 hooks/
Кастомные React хуки:

```
hooks/
├── useYouTube.ts          # Хук для работы с YouTube API
└── index.ts              # Экспорт хуков
```

### 🔧 services/
API сервисы и внешние интеграции:

```
services/
├── youtubeService.ts      # Сервис для YouTube API
└── index.ts              # Экспорт сервисов
```

### 🛠 utils/
Утилиты, константы и вспомогательные функции:

```
utils/
├── utils.ts              # Общие утилиты (cn, clsx)
├── constants.ts          # Константы приложения
└── index.ts             # Экспорт утилит
```

### 📝 types/
TypeScript типы и интерфейсы:

```
types/
├── youtube.ts            # Типы для YouTube API
├── index.ts              # Общие типы
└── index.ts              # Главный экспорт типов
```

### 📄 pages/
Страницы приложения:

```
pages/
├── Home.tsx              # Главная страница
└── index.ts              # Экспорт страниц
```

### 🎨 assets/
Статические ресурсы:

```
assets/
├── aurelo-logo.png       # Логотип приложения
└── index.ts              # Экспорт ассетов
```

### 🔥 firebase.ts
Конфигурация Firebase

### 🎨 index.css
Глобальные стили

### 🚀 main.tsx
Точка входа приложения

### 📱 App.tsx
Главный компонент приложения

### 🔧 vite-env.d.ts
Типы для Vite и модулей

## 📁 Структура public/

```
public/
├── _redirects            # Редиректы для Netlify
├── policies/             # Политики и документы
└── test-tiktok-api.html  # Тестовая страница
```

## 📁 Структура netlify/

```
netlify/
├── functions/            # Serverless функции
│   └── youtube-oauth.js  # OAuth функция для YouTube
└── netlify.toml          # Конфигурация Netlify
```

## 🔧 Конфигурационные файлы

### package.json
- Зависимости проекта
- Скрипты для разработки и сборки
- Метаданные проекта

### vite.config.ts
- Конфигурация Vite
- Настройки сборки
- Плагины

### tailwind.config.js
- Конфигурация Tailwind CSS
- Кастомные цвета и темы
- Плагины

### tsconfig.json
- Конфигурация TypeScript
- Настройки компиляции
- Пути к модулям

### eslint.config.js
- Конфигурация ESLint
- Правила линтинга
- Плагины

## 🎯 Основные функции

### 🔐 Аутентификация
- Firebase Authentication
- Email/Password вход
- Защищенные маршруты

### 📺 YouTube интеграция
- OAuth 2.0 авторизация
- Загрузка видео
- Просмотр статистики
- Управление каналом

### 📊 Аналитика
- Dashboard с метриками
- Анализ видео
- Статистика каналов

### 🤖 ИИ функции
- AI Chat для маркетинга
- Анализ трендов
- Рекомендации контента

### 🔄 Автоматизация
- Социальные сети
- Планирование постов
- Анализ конкурентов

## 🚀 Развертывание

Проект готов к развертыванию на:
- Netlify (рекомендуется)
- Vercel
- Firebase Hosting
- Любой статический хостинг

## 📚 Документация

- `README.md` - Основная документация
- `DEPLOYMENT.md` - Инструкции по развертыванию
- `PROJECT_STRUCTURE.md` - Этот файл
- `env.example` - Пример переменных окружения 