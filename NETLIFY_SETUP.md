# Настройка Netlify Functions для YouTube Integration

## Что такое Netlify Functions?

Netlify Functions - это серверные функции, которые выполняются на серверах Netlify. Они позволяют:
- Скрыть секретные ключи (CLIENT_SECRET) от клиента
- Выполнять серверную логику безопасно
- Обрабатывать OAuth токены на сервере

## Структура проекта

```
netlify/
  functions/
    youtube-oauth.js     # OAuth авторизация
    youtube-upload.js    # Загрузка видео
```

## Настройка переменных окружения

### 1. В Netlify Dashboard:
1. Зайдите в ваш проект на Netlify
2. Перейдите в **Site settings** → **Environment variables**
3. Добавьте следующие переменные:

```
YOUTUBE_CLIENT_ID=246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_REDIRECT_URI=https://your-app-name.netlify.app/auth/youtube/callback
```

### 2. Для локальной разработки:
Создайте файл `.env.local` в корне проекта:

```
YOUTUBE_CLIENT_ID=246610717965-1jb1lp72pi767l4v3s0am9kfo8rmgiac.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=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
YOUTUBE_REDIRECT_URI=http://localhost:3003/auth/youtube/callback
```

## Как работают функции

### youtube-oauth.js
- Обрабатывает OAuth авторизацию
- Получает код авторизации от Google
- Обменивает код на access_token и refresh_token
- Возвращает токены клиенту

### youtube-upload.js
- Загружает видео на YouTube
- Получает информацию о канале
- Использует access_token для авторизации

## Тестирование функций

### 1. Локальное тестирование:
```bash
# Запустите локальный сервер для функций
node server.js

# В другом терминале запустите приложение
npm run dev
```

### 2. Тестирование в браузере:
1. Откройте приложение
2. Перейдите в YouTube Integration
3. Нажмите "Connect YouTube Account"
4. После авторизации нажмите "Get Channel Info (Secure)"

## URL для функций

- **OAuth**: `/.netlify/functions/youtube-oauth`
- **Upload**: `/.netlify/functions/youtube-upload`

## Безопасность

✅ **Что скрыто на сервере:**
- CLIENT_SECRET
- Логика обмена кодов на токены
- Загрузка видео

✅ **Что остается на клиенте:**
- CLIENT_ID (не секретный)
- Access tokens (хранятся в localStorage)
- UI компоненты

## Устранение неполадок

### Ошибка "Function not found"
- Убедитесь, что функции находятся в `netlify/functions/`
- Проверьте, что файлы имеют расширение `.js`

### Ошибка "Environment variables not found"
- Проверьте переменные окружения в Netlify Dashboard
- Убедитесь, что имена переменных совпадают

### Ошибка CORS
- Функции уже настроены для CORS
- Проверьте, что запросы идут на правильные URL

## Деплой

1. Закоммитьте изменения:
```bash
git add .
git commit -m "Add Netlify Functions for YouTube integration"
git push
```

2. Netlify автоматически задеплоит функции

3. Проверьте логи в Netlify Dashboard → Functions 