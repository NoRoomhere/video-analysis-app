import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Video, 
  FileText, 
  Users, 
  Music, 
  Hash, 
  Target, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
  Share2,
  Eye,
  ThumbsUp,
  Clock
} from 'lucide-react';

interface FormData {
  tema: string;
  hook: string;
  message: string;
  audience: string;
  visual_style: string;
  audio: string;
  cta: string;
  hashtags: string;
  goal: string;
  unique: string;
}

interface RecommendationSection {
  title: string;
  contextLabel?: string;
  contextValue?: string;
  recommendation: string;
  why: string;
  example: string;
  icon: 'Sparkles' | 'Target' | 'Eye' | 'Clock' | 'ThumbsUp' | 'Music' | 'Video';
}

interface AnalysisResults {
  recommendations: string; // полный текст для копирования/скачивания
  analysis_time: number;
  form_data: FormData;
  sections: RecommendationSection[];
}

const iconMap: Record<RecommendationSection['icon'], React.FC<any>> = {
  Sparkles,
  Target,
  Eye,
  Clock,
  ThumbsUp,
  Music,
  Video
};

const VideoAnalyzer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    tema: '',
    hook: '',
    message: '',
    audience: '',
    visual_style: '',
    audio: '',
    cta: '',
    hashtags: '',
    goal: '',
    unique: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeVideo = async () => {
    // Проверяем обязательные поля
    if (!formData.tema || !formData.hook || !formData.message) {
      setError('Пожалуйста, заполните обязательные поля');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Имитируем анализ (в реальном приложении здесь будет API вызов)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results: AnalysisResults = {
        recommendations: generateRecommendations(formData),
        analysis_time: 3.0,
        form_data: formData,
        sections: generateSections(formData)
      };
      
      setAnalysisResults(results);
    } catch (err) {
      setError('Ошибка при анализе видео');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRecommendations = (data: FormData): string => {
    return `
1. Оптимизация хука для мгновенного захвата внимания\nТема вашего видео: «${data.tema}»\nВаш текущий хук: «${data.hook}»\n\nРекомендация: Используйте неожиданный визуальный элемент в первые 1-2 секунды. Например, если это фитнес‑видео, покажите результат "до/после" или используйте яркий цветовой контраст.\n\nПочему работает: Instagram анализирует удержание в первые 3 секунды. Неожиданность повышает удержание на 40‑60%.\n\nПример: Начните с крупного плана результата, затем переходите к процессу.\n\n2. Улучшение повествования для максимального удержания\nВаше сообщение: «${data.message}»\n\nРекомендация: Постройте сюжет по схеме "проблема‑решение‑результат" (15‑30 c).\n\nПочему работает: Чёткая ценность удерживает зрителя и повышает досмотры.\n\nПример: Проблема (0‑5 c), процесс (5‑25 c), результат (25‑30 c).\n\n3. Визуальные техники для повышения вовлеченности\nВаш визуальный стиль: ${data.visual_style}\n\nРекомендация: Добавьте динамические переходы и текстовые оверлеи с ключевыми словами.\n\nПочему работает: Динамичный контент получает на 35% больше просмотров и 50% больше шеров.\n\nПример: Быстрые переходы между кадрами + текст поверх видео.\n\n4. Звуковой дизайн для вирусности\nВаша аудио‑стратегия: ${data.audio}\n\nРекомендация: Синхронизируйте музыку с действиями на экране, добавьте лёгкие ASMR‑элементы.\n\nПочему работает: Синхронизация увеличивает engagement на ~45% и retention на ~30%.\n\nПример: Подгоняйте удары/биты под смены планов и движения.\n\n5. Призывы к действию (CTA) для роста взаимодействий\nВаш CTA: ${data.cta}\n\nРекомендация: Встраивайте CTA органично в середину контента, а не только в конце.\n\nПочему работает: Органичные CTA получают в 3 раза кликабельнее и не раздражают.\n\nПример: Во время демонстрации фичи — короткий текст/озвучка с CTA.\n\n6. SEO и дистрибуция для алгоритмического продвижения\nВаши хэштеги: ${data.hashtags}\n\nРекомендация: Смешайте популярные (1‑2) и нишевые (3‑4) хэштеги + добавьте текст‑оверлей с ключевыми словами.\n\nПочему работает: Смешанная стратегия увеличивает охват на ~60% и приводит целевую аудиторию.\n\nПример: #fitness + #homeworkout #beginnerfitness #30daychallenge.\n\n7. Эксперименты для масштабирования просмотров\nВаша цель: ${data.goal}\n\nРекомендация: Сделайте 3‑5 версий ролика с разными хуками и стилистикой (A/B).\n\nПочему работает: Так быстрее найти “победные” паттерны и масштабировать их.\n\nПример: 3 версии одного ролика, сравнить удержание первых 5‑10 секунд.\n\n8. Уникальные элементы для выделения в ленте\nВаши уникальные элементы: ${data.unique}\n\nРекомендация: Добавьте деталь, которой нет у конкурентов: ракурс, реквизит, локация, приём.\n\nПочему работает: “Вау‑эффект” повышает долю шерлинга до 70%.\n\nПример: Необычный ракурс/костюм/локация/монтажный приём.\n\nОжидаемый результат: Рост просмотров на 200‑500% и вовлечённости на 150‑300% за 2‑4 недели при внедрении рекомендаций.`;
  };

  const generateSections = (data: FormData): RecommendationSection[] => {
    return [
      {
        icon: 'Sparkles',
        title: 'Оптимизация хука для мгновенного захвата внимания',
        contextLabel: 'Тема / Хук',
        contextValue: `«${data.tema}» / «${data.hook}»`,
        recommendation: 'Используйте неожиданный визуальный элемент в первые 1–2 секунды: контраст, крупный план результата, “до/после”.',
        why: 'Алгоритмы учитывают удержание первых 3 с. Неожиданность повышает удержание на 40–60%.',
        example: 'Начните с крупного плана результата, затем переходите к процессу.'
      },
      {
        icon: 'Target',
        title: 'Улучшение повествования для максимального удержания',
        contextLabel: 'Сообщение',
        contextValue: `«${data.message}»`,
        recommendation: 'Структура “проблема → решение → результат” внутри 15–30 секунд.',
        why: 'Чёткая ценность удерживает зрителя и повышает досмотры.',
        example: '0–5 c — проблема; 5–25 c — процесс; 25–30 c — результат.'
      },
      {
        icon: 'Eye',
        title: 'Визуальные техники для повышения вовлеченности',
        contextLabel: 'Визуальный стиль',
        contextValue: data.visual_style,
        recommendation: 'Добавьте динамичные переходы и текстовые оверлеи с ключевыми словами.',
        why: 'Более динамичное видео получает на 35% больше просмотров и 50% больше шеров.',
        example: 'Короткие резкие переходы + ключевые фразы в титрах.'
      },
      {
        icon: 'Music',
        title: 'Звуковой дизайн для вирусности',
        contextLabel: 'Аудио',
        contextValue: data.audio,
        recommendation: 'Синхронизируйте музыку с действиями на экране, добавьте лёгкие ASMR‑элементы.',
        why: 'Синхронизация увеличивает engagement на ~45% и retention на ~30%.',
        example: 'Подгоняйте удары/биты под смены планов и движения.'
      },
      {
        icon: 'ThumbsUp',
        title: 'Призывы к действию (CTA) для роста взаимодействий',
        contextLabel: 'CTA',
        contextValue: data.cta,
        recommendation: 'Размещайте короткие CTA органично в середине сюжета, а не только в финале.',
        why: 'Органичные CTA в 3 раза кликабельнее и не раздражают зрителя.',
        example: 'Во время демонстрации фичи — короткий текст/озвучка с CTA.'
      },
      {
        icon: 'Clock',
        title: 'SEO и дистрибуция для алгоритмического продвижения',
        contextLabel: 'Хэштеги',
        contextValue: data.hashtags,
        recommendation: 'Комбинируйте 1–2 популярных и 3–4 нишевых хэштега + добавляйте текст‑оверлей с ключевыми словами.',
        why: 'Смешанная стратегия помогает алгоритмам и приводит нужную аудиторию.',
        example: '#fitness + #homeworkout #beginnerfitness #30daychallenge.'
      },
      {
        icon: 'Video',
        title: 'Эксперименты для масштабирования просмотров',
        contextLabel: 'Цель',
        contextValue: data.goal,
        recommendation: 'Снимите 3–5 версий с разными хуками/стилем и проведите A/B‑тест.',
        why: 'Так быстрее найти “победные” паттерны и масштабировать их.',
        example: 'Сравните удержание первых 5–10 секунд между версиями.'
      },
      {
        icon: 'Sparkles',
        title: 'Уникальные элементы для выделения в ленте',
        contextLabel: 'Уникальность',
        contextValue: data.unique,
        recommendation: 'Добавьте деталь, которой никто в нише не использует.',
        why: '“Вау‑эффект” повышает долю шерлинга до 70%.',
        example: 'Необычный ракурс/костюм/локация/монтажный приём.'
      }
    ];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>✨ Анализ видео с ИИ ✨</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Анализатор видео
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Платформа анализа видео с ИИ для создания вирусного контента
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {['Анализ видео'].map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Загрузка видео</h3>
          <p className="text-gray-600 mb-6">
            Выберите файл формата MP4/AVI/MOV/MKV/WMV. После загрузки заполните форму и нажмите «Получить экспертные рекомендации».
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".mp4,.avi,.mov,.mkv,.wmv"
              onChange={handleFileUpload}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {uploadedFile ? uploadedFile.name : 'Выберите видеофайл'}
              </p>
              <p className="text-sm text-gray-500">
                {uploadedFile ? `Размер: ${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Поддерживаемые форматы: MP4, AVI, MOV, MKV, WMV'}
              </p>
            </label>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Информация о видео</h3>
          <p className="text-gray-600 mb-6">
            Опишите ключевые параметры вашего ролика — это поможет ИИ сформировать точные рекомендации.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Тема видео *
                </label>
                <textarea
                  value={formData.tema}
                  onChange={(e) => handleInputChange('tema', e.target.value)}
                  placeholder="Что вы показываете в видео?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Хук видео *
                </label>
                <textarea
                  value={formData.hook}
                  onChange={(e) => handleInputChange('hook', e.target.value)}
                  placeholder="Как захватываете внимание в первые 1-3 секунды?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Целевое сообщение *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Что хотите донести зрителям?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Целевая аудитория
                </label>
                <textarea
                  value={formData.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                  placeholder="Кто ваши зрители?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline mr-2" />
                  Визуальный стиль
                </label>
                <textarea
                  value={formData.visual_style}
                  onChange={(e) => handleInputChange('visual_style', e.target.value)}
                  placeholder="Какие визуальные элементы используете?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Music className="w-4 h-4 inline mr-2" />
                  Аудио и музыка
                </label>
                <textarea
                  value={formData.audio}
                  onChange={(e) => handleInputChange('audio', e.target.value)}
                  placeholder="Какой саундтрек используете?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Призыв к действию
                </label>
                <textarea
                  value={formData.cta}
                  onChange={(e) => handleInputChange('cta', e.target.value)}
                  placeholder="Какой CTA добавляете?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Хэштеги и SEO
                </label>
                <textarea
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="Какие хэштеги используете?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Цель видео
                </label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  placeholder="Какую цель преследуете?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Уникальные элементы
                </label>
                <textarea
                  value={formData.unique}
                  onChange={(e) => handleInputChange('unique', e.target.value)}
                  placeholder="Что особенного в видео?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-6">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={analyzeVideo}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Анализируем видео...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Получить экспертные рекомендации</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-3xl font-bold text-gray-900">Экспертные рекомендации</h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResults.sections.map((s, idx) => {
                const IconCmp = iconMap[s.icon];
                return (
                  <div key={idx} className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          <IconCmp className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                      </div>
                      <span className="text-sm text-gray-400">#{idx + 1}</span>
                    </div>

                    {s.contextValue && (
                      <div className="mb-3 text-sm">
                        <span className="text-gray-500">{s.contextLabel}: </span>
                        <span className="font-medium text-gray-900">{s.contextValue}</span>
                      </div>
                    )}

                    <div className="space-y-3 text-sm leading-6">
                      <div>
                        <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Рекомендация</p>
                        <p className="text-gray-800">{s.recommendation}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Почему работает</p>
                        <p className="text-gray-800">{s.why}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-xs text-gray-500 mb-1">Пример реализации</p>
                        <p className="text-gray-800">{s.example}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expected result */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-200 p-6">
              <p className="text-sm text-emerald-700">
                Ожидаемый результат: Рост просмотров на 200–500% и вовлечённости на 150–300% за 2–4 недели при внедрении рекомендаций.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => copyToClipboard(analysisResults.recommendations)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Копировать рекомендации</span>
              </button>
              
              <button
                onClick={() => {
                  const blob = new Blob([analysisResults.recommendations], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'video-analysis-recommendations.txt';
                  a.click();
                }}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Скачать отчет</span>
              </button>
              
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Анализ видео',
                      text: analysisResults.recommendations.substring(0, 200) + '...',
                      url: window.location.href
                    });
                  }
                }}
                className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalyzer;
