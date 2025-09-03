import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageTest: React.FC = () => {
  const { t, language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Тест локализации</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Текущий язык: {language}</h3>
        <div className="flex gap-2">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1 rounded ${
                language === lang.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Навигация:</strong> {t('navigation.dashboard')}</p>
        <p><strong>Общие элементы:</strong> {t('common.loading')}</p>
        <p><strong>AI Ассистент:</strong> {t('aiAssistant.title')}</p>
        <p><strong>Мои планы:</strong> {t('savedPlans.title')}</p>
        <p><strong>Анализ видео:</strong> {t('videoAnalysis.title')}</p>
        <p><strong>Dashboard:</strong> {t('dashboard.title')}</p>
        <p><strong>YouTube:</strong> {t('youtube.title')}</p>
      </div>
    </div>
  );
};

export default LanguageTest; 