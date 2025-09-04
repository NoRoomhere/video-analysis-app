export type Language = 'ru' | 'uk' | 'en';

export const translations: Record<Language, any> = {
  ru: {
    footer: {
      brand: 'Aurelo'
    },
    navigation: {
      dashboard: 'Дашборд',
      videoAnalysis: 'Анализ видео',
      socialMedia: 'Соцсети',
      competitors: 'Конкуренты',
      trends: 'Тренды',
      aiAssistant: 'ИИ‑ассистент',
      myPlans: 'Мои планы',
      affiliate: 'Партнёрская программа',
      policies: 'Политики'
    },
    common: {
      loading: 'Загрузка…',
      error: 'Ошибка',
      success: 'Успех',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      copy: 'Копировать',
      copied: 'Скопировано',
      search: 'Поиск',
      filter: 'Фильтр',
      export: 'Экспорт',
      import: 'Импорт',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      previous: 'Назад',
      finish: 'Готово',
      start: 'Начать',
      continue: 'Продолжить',
      retry: 'Повторить',
      yes: 'Да',
      no: 'Нет',
      ok: 'ОК',
      confirm: 'Подтвердить',
      view: 'Просмотр',
      download: 'Скачать',
      upload: 'Загрузить',
      share: 'Поделиться',
      favorite: 'В избранное',
      unfavorite: 'Убрать из избранного',
      settings: 'Настройки',
      profile: 'Профиль',
      logout: 'Выйти',
      login: 'Вход',
      register: 'Регистрация',
      signIn: 'Войти',
      signUp: 'Зарегистрироваться',
      signOut: 'Выйти',
      account: 'Аккаунт',
      password: 'Пароль',
      email: 'Email',
      name: 'Имя',
      phone: 'Телефон',
      address: 'Адрес',
      city: 'Город',
      country: 'Страна',
      language: 'Язык',
      theme: 'Тема',
      dark: 'Тёмная',
      light: 'Светлая',
      auto: 'Авто',
      filters: 'Фильтры',
      actions: 'Действия',
      resetFilters: 'Сбросить фильтры',
      platforms: 'Платформы',
      tiktok: 'TikTok',
      instagram: 'Instagram',
      status: 'Статус',
      favoritesOnly: 'Только избранное',
    },
    landingHeader: {
      brand: 'Aurelo',
      features: 'Особенности',
      pricing: 'Тарифы',
      faq: 'FAQ',
      login: 'Вход',
      signUp: 'Регистрация'
    },
    hero: {
      badge: 'Анализ видео с ИИ',
      heading: 'Создавайте',
      headingAccent: 'вирусный контент',
      subtitle: 'Платформа анализа видео с ИИ, трендами и конкурентной аналитикой',
      features: {
        videoAnalysis: 'Анализ видео',
        trendPrediction: 'Прогноз трендов',
        competitorInsights: 'Инсайты конкурентов',
        smartAnalytics: 'Умная аналитика'
      },
      cta: {
        startTrial: 'Начать бесплатно',
        watchDemo: 'Смотреть демо'
      },
      stats: {
        activeUsers: 'Активных пользователей',
        videosAnalyzed: 'Видео проанализировано',
        accuracyRate: 'Точность рекомендаций',
        aiSupport: 'Поддержка ИИ'
      }
    },
    features: {
      badge: 'Возможности',
      heading: 'Мощные ',
      headingAccent: 'инструменты',
      subtitle: 'Всё, что нужно для роста каналов и создания вирусного контента',
      aiWebsiteOptimization: {
        title: 'ИИ‑оптимизация контента',
        description: 'Оптимизируйте заголовки, описания и визуал, чтобы повышать удержание.'
      },
      autoSocialMediaPosts: {
        title: 'Автопостинг',
        description: 'Планируйте и публикуйте контент в соцсетях в одно касание.'
      },
      competitorAnalysis: {
        title: 'Анализ конкурентов',
        description: 'Сравнивайте стратегии и находите точки роста.'
      },
      videoPsychologyAnalysis: {
        title: 'Психология видео',
        description: 'Выявляем триггеры внимания и причины оттока зрителей.'
      },
      trendingContentFeed: {
        title: 'Лента трендов',
        description: 'Следите за трендами и прогнозируйте темы заранее.'
      },
      videoPotentialAnalyzer: {
        title: 'Потенциал видео',
        description: 'Оцениваем шансы на вирусность и даём рекомендации.'
      },
      affiliateProgram: {
        title: 'Партнёрская программа',
        description: 'Зарабатывайте, рекомендуя платформу друзьям и клиентам.'
      },
      ctaTitle: 'Готовы ускорить рост канала?',
      ctaSubtitle: 'Подключите ИИ‑инструменты и получайте чёткие рекомендации для каждого ролика.',
      ctaButton: 'Начать сейчас'
    }
  },
  uk: {
    footer: {
      brand: 'Aurelo'
    },
    // Базовые значения (можно позже локализовать отдельно); используем русский как запасной
    navigation: {
      dashboard: 'Дашборд',
      videoAnalysis: 'Аналіз відео',
      socialMedia: 'Соцмережі',
      competitors: 'Конкуренти',
      trends: 'Тренди',
      aiAssistant: 'Інтелект‑асистент',
      myPlans: 'Мої плани',
      affiliate: 'Партнерська програма',
      policies: 'Політики'
    },
    landingHeader: {
      brand: 'Aurelo',
      features: 'Можливості',
      pricing: 'Тарифи',
      faq: 'FAQ',
      login: 'Вхід',
      signUp: 'Реєстрація'
    },
    hero: {
      badge: 'Аналіз відео з ІІ',
      heading: 'Створюйте',
      headingAccent: 'віральний контент',
      subtitle: 'Платформа аналізу відео з ІІ, трендами та конкурентною аналітикою',
      features: {
        videoAnalysis: 'Аналіз відео',
        trendPrediction: 'Прогноз трендів',
        competitorInsights: 'Інсайти конкурентів',
        smartAnalytics: 'Розумна аналітика'
      },
      cta: { startTrial: 'Почати безкоштовно', watchDemo: 'Подивитись демо' },
      stats: {
        activeUsers: 'Активних користувачів',
        videosAnalyzed: 'Відео проаналізовано',
        accuracyRate: 'Точність рекомендацій',
        aiSupport: 'Підтримка ІІ'
      }
    },
    features: {
      badge: 'Можливості',
      heading: 'Потужні ',
      headingAccent: 'інструменти',
      subtitle: 'Все необхідне для росту каналів і створення вірального контенту',
      aiWebsiteOptimization: {
        title: 'ІІ‑оптимізація контенту',
        description: 'Оптимізуйте заголовки, описи та візуал.'
      },
      autoSocialMediaPosts: { title: 'Автопостинг', description: 'Планування та публікація контенту.' },
      competitorAnalysis: { title: 'Аналіз конкурентів', description: 'Порівняння стратегій.' },
      videoPsychologyAnalysis: { title: 'Психологія відео', description: 'Тригери уваги.' },
      trendingContentFeed: { title: 'Стрічка трендів', description: 'Стеження за трендами.' },
      videoPotentialAnalyzer: { title: "Потенціал відео", description: 'Оцінка шансів на віральність.' },
      affiliateProgram: { title: 'Партнерська програма', description: 'Заробляйте з рекомендацій.' },
      ctaTitle: 'Готові прискорити ріст каналу?',
      ctaSubtitle: 'Підключіть ІІ‑інструменти для чітких рекомендацій.',
      ctaButton: 'Почати зараз'
    }
  },
  en: {
    footer: {
      brand: 'Aurelo'
    },
    navigation: {
      dashboard: 'Dashboard',
      videoAnalysis: 'Video Analysis',
      socialMedia: 'Social Media',
      competitors: 'Competitors',
      trends: 'Trends',
      aiAssistant: 'AI Assistant',
      myPlans: 'My Plans',
      affiliate: 'Affiliate Program',
      policies: 'Policies'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      copy: 'Copy',
      copied: 'Copied',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      start: 'Start',
      continue: 'Continue',
      retry: 'Retry',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      confirm: 'Confirm',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      share: 'Share',
      favorite: 'Favorite',
      unfavorite: 'Remove from favorites',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      account: 'Account',
      password: 'Password',
      email: 'Email',
      name: 'Name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      auto: 'Auto',
      filters: 'Filters',
      actions: 'Actions',
      resetFilters: 'Reset Filters',
      platforms: 'Platforms',
      tiktok: 'TikTok',
      instagram: 'Instagram',
      status: 'Status',
      favoritesOnly: 'Only favorites',
    },
    hero: {
      badge: 'AI Video Analysis',
      heading: 'Create',
      headingAccent: 'viral content',
      subtitle: 'AI‑powered video analysis platform with trends and competitor insights',
      features: {
        videoAnalysis: 'Video Analysis',
        trendPrediction: 'Trend Prediction',
        competitorInsights: 'Competitor Insights',
        smartAnalytics: 'Smart Analytics'
      },
      cta: { startTrial: 'Start Trial', watchDemo: 'Watch Demo' },
      stats: {
        activeUsers: 'Active users',
        videosAnalyzed: 'Videos analyzed',
        accuracyRate: 'Accuracy rate',
        aiSupport: 'AI support'
      }
    },
    features: {
      badge: 'Features',
      heading: 'Powerful ',
      headingAccent: 'tools',
      subtitle: 'Everything you need to grow channels and create viral content',
      aiWebsiteOptimization: { title: 'AI Website Optimization', description: 'Optimize titles, descriptions and visuals.' },
      autoSocialMediaPosts: { title: 'Auto Social Posts', description: 'Plan and publish across social networks.' },
      competitorAnalysis: { title: 'Competitor Analysis', description: 'Compare strategies and find growth points.' },
      videoPsychologyAnalysis: { title: 'Video Psychology', description: 'Find attention triggers and drop‑off causes.' },
      trendingContentFeed: { title: 'Trending Feed', description: 'Track trends and forecast topics.' },
      videoPotentialAnalyzer: { title: 'Video Potential Analyzer', description: 'Estimate virality chances and get tips.' },
      affiliateProgram: { title: 'Affiliate Program', description: 'Earn by recommending the platform.' },
      ctaTitle: 'Ready to accelerate growth?',
      ctaSubtitle: 'Connect AI tools and get clear recommendations for every video.',
      ctaButton: 'Get started'
    },
    savedPlans: {
      title: 'Saved Content Plans',
      subtitle: 'Manage and analyze your created content plans',
      noPlans: 'No saved plans',
      noPlansFound: 'No plans found',
      createFirstPlan: 'Create your first content plan in the AI section',
      tryFiltersOrSearch: 'Try changing filters or search query',
      totalPlans: 'Total plans',
      favorites: 'Favorites',
      thisMonth: 'This month',
      popularPlatform: 'Popular platform',
      searchPlaceholder: 'Search by name, description or tags...',
      videos: 'videos',
      moreVideos: 'And {count} more videos...',
      planInfo: 'Plan information',
      description: 'Description',
      createdAt: 'Created',
      tags: 'Tags',
      videoSchedule: 'Video schedule',
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites',
      onlyFavorites: 'Only favorites',
      status: 'Status',
      platforms: 'Platforms',
    }
  }
};