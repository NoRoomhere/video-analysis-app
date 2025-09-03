interface VideoAnalysisData {
  results: any[];
  objectStats: Record<string, number>;
  emotionStats: Record<string, number>;
  colorStats: Record<string, number>;
  compositionStats: {
    ruleOfThirds: number;
    symmetry: number;
    depth: number;
  };
  movementStats: {
    static: number;
    slight: number;
    dynamic: number;
  };
  lightingStats: {
    dark: number;
    good: number;
    bright: number;
  };
  qualityScore: number;
  engagementScore: number;
  contentType: string;
  videoContext: string;
  videoTheme: string;
  platform: string;
  totalFrames: number;
  blurFrames: number;
  framesWithFaces: number;
  framesWithText: number;
  dominantEmotion: string;
  happyPercentage: number;
  sadPercentage: number;
  uniqueObjects: string[];
  ocrTexts: string[];
}

interface AIInsights {
  context: string;
  theme: string;
  targetAudience: string;
  uniqueRecommendations: string[];
  personalizedTips: string[];
  videoPersonality: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  creativeSuggestions: string[];
  visualAnalysis?: {
    composition: string;
    lighting: string;
    colors: string;
    movement: string;
  };
}

interface VideoFrameData {
  frame: number;
  imageData: string; // base64
}

interface UserAnswers {
  [questionId: string]: string | string[];
}

interface ContentPlan {
  title: string;
  description: string;
  goals: string[];
  targetAudience: string;
  contentStrategy: string;
  platformStrategy: {
    TikTok: {
      contentTypes: string[];
      postingSchedule: string;
      optimizationTips: string[];
    };
    Instagram: {
      contentTypes: string[];
      postingSchedule: string;
      optimizationTips: string[];
    };
    YouTube?: {
      contentTypes: string[];
      postingSchedule: string;
      optimizationTips: string[];
    };
    [key: string]: any; // For other platforms
  };
  videoSchedule: VideoSchedule[];
  contentIdeas: string[];
  hashtagStrategy: string[];
  engagementStrategy: string[];
  measurementMetrics: string[];
  timeline: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
}

interface VideoSchedule {
  day: number;
  topic: string;
  whatToShow: string;
  hook: string;
  platform: string;
  duration: string;
  hashtags: string[];
}

import { contentPlanStorage } from './contentPlanStorage';

export class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    console.log('🔑 AI Service initialized');
    console.log('🔑 API Key status:', this.apiKey ? '✅ Found' : '❌ Not found');
    if (this.apiKey) {
      console.log('🔑 API Key preview:', this.apiKey.substring(0, 10) + '...');
    }
  }

  // Проверка API ключа и тестовый запрос
  async testAPI(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('❌ OpenAI API ключ не найден');
      return false;
    }

    try {
      console.log('🧪 Testing OpenAI API...');
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: 'Привет! Это тестовое сообщение для проверки API.'
            }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Test failed:', response.status, errorText);
        return false;
      }

      const data = await response.json();
      console.log('✅ API Test successful:', data.choices[0]?.message?.content);
      return true;
    } catch (error) {
      console.error('❌ API Test error:', error);
      return false;
    }
  }

  async getVideoInsights(videoData: VideoAnalysisData): Promise<AIInsights> {
    console.log('🎬 Starting video analysis with AI...');
    
    // Сначала тестируем API
    const apiWorking = await this.testAPI();
    
    if (!apiWorking) {
      console.warn('⚠️ OpenAI API недоступен, используем локальную логику');
      return this.generateAdvancedLocalInsights(videoData);
    }

    try {
      console.log('📊 Preparing detailed analysis data...');
      console.log(`📈 Video metrics: ${videoData.totalFrames} frames, ${videoData.qualityScore}/100 quality, ${videoData.engagementScore}/100 engagement`);
      console.log(`🎭 Content type: ${videoData.contentType}, Platform: ${videoData.platform}`);
      console.log(`👥 Faces detected: ${videoData.framesWithFaces}/${videoData.totalFrames} frames`);
      console.log(`📝 Text detected: ${videoData.framesWithText}/${videoData.totalFrames} frames`);
      console.log(`😊 Happy emotions: ${videoData.happyPercentage.toFixed(1)}%`);
      console.log(`😢 Sad emotions: ${videoData.sadPercentage.toFixed(1)}%`);
      console.log(`🎨 Objects found: ${videoData.uniqueObjects.join(', ')}`);
      
      // Детальный анализ технических параметров
      console.log('🔬 Technical analysis details:');
      const focusStats = { excellent: 0, good: 0, fair: 0, poor: 0 };
      const textureStats = { detailed: 0, textured: 0, smooth: 0 };
      const dynamicRangeStats = { high: 0, medium: 0, low: 0 };
      const saturationStats = { high: 0, medium: 0, low: 0 };
      const temperatureStats = { warm: 0, cool: 0, neutral: 0 };
      
      videoData.results.forEach(frame => {
        if (frame.focus) focusStats[frame.focus.quality as keyof typeof focusStats]++;
        if (frame.textures) textureStats[frame.textures.type as keyof typeof textureStats]++;
        if (frame.dynamicRange) dynamicRangeStats[frame.dynamicRange.range as keyof typeof dynamicRangeStats]++;
        if (frame.saturation) saturationStats[frame.saturation.level as keyof typeof saturationStats]++;
        if (frame.colorTemperature) temperatureStats[frame.colorTemperature.temperature as keyof typeof temperatureStats]++;
      });
      
      console.log(`📸 Focus quality: ${Object.entries(focusStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'}`);
      console.log(`🎨 Texture type: ${Object.entries(textureStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'}`);
      console.log(`📊 Dynamic range: ${Object.entries(dynamicRangeStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'}`);
      console.log(`🌈 Saturation: ${Object.entries(saturationStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'}`);
      console.log(`🌡️ Color temperature: ${Object.entries(temperatureStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'}`);
      
      const prompt = this.createAdvancedPrompt(videoData);
      console.log('📝 Generated advanced prompt for GPT-4...');
      console.log(`📏 Prompt length: ${prompt.length} characters`);
      console.log('📋 Prompt preview (first 500 chars):', prompt.substring(0, 500) + '...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Ты ведущий эксперт по созданию вирусного контента для социальных сетей с 15-летним опытом. 
              Твоя задача - анализировать видео и давать уникальные, креативные советы, которые удивят клиента.
              
              Ты должен думать как успешный контент-мейкер с миллионами подписчиков и давать советы, которые действительно работают.
              Будь максимально креативным, но практичным. Каждый совет должен быть уникальным для данного видео.
              
              Используй современные тренды, психологию восприятия и лучшие практики создания контента.
              Дай советы, которые заставят видео выделиться среди миллионов других.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 2000
        })
      });

      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API ошибка: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received');
      console.log('💰 Tokens used:', data.usage);
      console.log(`💬 Response tokens: ${data.usage?.total_tokens || 'unknown'}`);
      console.log(`💰 Estimated cost: $${((data.usage?.total_tokens || 0) * 0.00003).toFixed(4)}`);
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Пустой ответ от API');
      }

      console.log('📄 Raw AI response length:', content.length);
      console.log('📄 Response preview (first 300 chars):', content.substring(0, 300) + '...');

      try {
        const insights = JSON.parse(content);
        console.log('✅ JSON parsed successfully');
        console.log(`🎯 Generated ${insights.uniqueRecommendations?.length || 0} unique recommendations`);
        console.log(`💡 Generated ${insights.personalizedTips?.length || 0} personalized tips`);
        console.log(`🚀 Generated ${insights.creativeSuggestions?.length || 0} creative suggestions`);
        return this.validateAdvancedInsights(insights);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.log('📄 Raw content:', content.substring(0, 500) + '...');
        return this.generateAdvancedLocalInsights(videoData);
      }

    } catch (error) {
      console.error('❌ Error getting AI insights:', error);
      return this.generateAdvancedLocalInsights(videoData);
    }
  }

  // Новая функция для анализа видео через GPT-4 Vision
  async analyzeVideoWithVision(videoFrames: VideoFrameData[]): Promise<AIInsights> {
    console.log('🎬 Starting GPT-4 Vision analysis...');
    console.log(`📊 Total frames received: ${videoFrames.length}`);
    
    if (!this.apiKey) {
      console.warn('❌ OpenAI API key not found, using local analysis');
      return this.generateAdvancedLocalInsights({
        results: [],
        objectStats: {},
        emotionStats: {},
        colorStats: {},
        compositionStats: { ruleOfThirds: 0, symmetry: 0, depth: 0 },
        movementStats: { static: 0, slight: 0, dynamic: 0 },
        lightingStats: { dark: 0, good: 0, bright: 0 },
        qualityScore: 0,
        engagementScore: 0,
        contentType: 'general',
        videoContext: 'general',
        videoTheme: 'entertainment',
        platform: 'general',
        totalFrames: 0,
        blurFrames: 0,
        framesWithFaces: 0,
        framesWithText: 0,
        dominantEmotion: 'neutral',
        happyPercentage: 0,
        sadPercentage: 0,
        uniqueObjects: [],
        ocrTexts: []
      });
    }

    try {
      // Выбираем ключевые кадры для анализа (каждый 5-й кадр)
      const keyFrames = videoFrames.filter((_, index) => index % 5 === 0).slice(0, 10);
      console.log(`🎯 Selected ${keyFrames.length} key frames for analysis`);
      
      const messages = [
        {
          role: 'system',
          content: `Ты эксперт по анализу видео для социальных сетей с 10-летним опытом создания вирусного контента. 
          Твоя задача - проанализировать кадры видео и дать уникальные, персонализированные советы для улучшения контента.

          Анализируй каждый аспект:
          - Визуальная композиция и кадрирование
          - Цветовая палитра и освещение
          - Движение и динамика
          - Эмоциональное воздействие
          - Объекты и элементы в кадре
          - Текст и надписи
          - Общее качество и стиль

          Дай конкретные, практичные советы для улучшения видео. Будь креативным и уникальным.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Проанализируй эти кадры из видео и создай детальный анализ в формате JSON:

{
  "context": "креативное описание что происходит в видео",
  "theme": "основная идея/тема видео", 
  "targetAudience": "точная целевая аудитория",
  "videoPersonality": "личность/характер видео",
  "strengths": ["3-4 сильные стороны этого видео"],
  "weaknesses": ["3-4 слабые стороны"],
  "opportunities": ["3-4 возможности для роста"],
  "uniqueRecommendations": ["5-7 уникальных, креативных советов"],
  "personalizedTips": ["5-7 персонализированных советов"],
  "creativeSuggestions": ["3-4 креативные идеи для улучшения"],
  "visualAnalysis": {
    "composition": "анализ композиции",
    "lighting": "анализ освещения", 
    "colors": "анализ цветов",
    "movement": "анализ движения"
  }
}

Будь максимально конкретным и креативным. Каждый совет должен быть уникальным для этого видео.`
            },
            ...keyFrames.map(frame => ({
              type: 'image_url',
              image_url: {
                url: frame.imageData,
                detail: 'high'
              }
            }))
          ]
        }
      ];

      console.log('📡 Sending request to GPT-4 Vision API...');
      console.log(`🖼️ Sending ${keyFrames.length} frames`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages,
          max_tokens: 2000,
          temperature: 0.9
        })
      });

      console.log('📡 Vision API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Vision API Error:', response.status, errorText);
        throw new Error(`Vision API ошибка: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Vision API Response received');
      console.log('💰 Vision API Tokens used:', data.usage);
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Пустой ответ от Vision API');
      }

      console.log('📄 Raw Vision AI response length:', content.length);

      try {
        const insights = JSON.parse(content);
        console.log('✅ Vision JSON parsed successfully');
        return this.validateAdvancedInsights(insights);
      } catch (parseError) {
        console.error('❌ Vision JSON parse error:', parseError);
        console.log('📄 Raw Vision content:', content.substring(0, 500) + '...');
        return this.generateAdvancedLocalInsights({
          results: [],
          objectStats: {},
          emotionStats: {},
          colorStats: {},
          compositionStats: { ruleOfThirds: 0, symmetry: 0, depth: 0 },
          movementStats: { static: 0, slight: 0, dynamic: 0 },
          lightingStats: { dark: 0, good: 0, bright: 0 },
          qualityScore: 0,
          engagementScore: 0,
          contentType: 'general',
          videoContext: 'general',
          videoTheme: 'entertainment',
          platform: 'general',
          totalFrames: 0,
          blurFrames: 0,
          framesWithFaces: 0,
          framesWithText: 0,
          dominantEmotion: 'neutral',
          happyPercentage: 0,
          sadPercentage: 0,
          uniqueObjects: [],
          ocrTexts: []
        });
      }

    } catch (error) {
      console.error('❌ Error in Vision analysis:', error);
      return this.generateAdvancedLocalInsights({
        results: [],
        objectStats: {},
        emotionStats: {},
        colorStats: {},
        compositionStats: { ruleOfThirds: 0, symmetry: 0, depth: 0 },
        movementStats: { static: 0, slight: 0, dynamic: 0 },
        lightingStats: { dark: 0, good: 0, bright: 0 },
        qualityScore: 0,
        engagementScore: 0,
        contentType: 'general',
        videoContext: 'general',
        videoTheme: 'entertainment',
        platform: 'general',
        totalFrames: 0,
        blurFrames: 0,
        framesWithFaces: 0,
        framesWithText: 0,
        dominantEmotion: 'neutral',
        happyPercentage: 0,
        sadPercentage: 0,
        uniqueObjects: [],
        ocrTexts: []
      });
    }
  }

  async generateContentPlan(userAnswers: UserAnswers): Promise<ContentPlan> {
    console.log('📋 Starting content plan generation...');
    console.log('📝 User answers:', userAnswers);
    
    // Сначала тестируем API
    const apiWorking = await this.testAPI();
    
    let contentPlan: ContentPlan;
    
    if (!apiWorking) {
      console.warn('⚠️ OpenAI API недоступен, используем локальную логику');
      contentPlan = this.generateLocalContentPlan(userAnswers);
    } else {
      try {
        const prompt = this.createContentPlanPrompt(userAnswers);
        console.log('📝 Generated content plan prompt...');
        console.log(`📏 Prompt length: ${prompt.length} characters`);
        console.log('📋 Prompt preview:', prompt.substring(0, 500) + '...');
        
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `Ты ведущий эксперт по созданию контент-планов для социальных сетей с 10-летним опытом работы с брендами и инфлюенсерами.
                
                Твоя задача - создать детальный, персонализированный контент-план на основе ответов клиента.
                
                Ты должен думать как успешный контент-стратег и создавать планы, которые действительно работают.
                Будь максимально практичным и креативным. Каждый элемент плана должен быть уникальным для данного клиента.
                
                Используй современные тренды, психологию аудитории и лучшие практики создания вирусного контента.
                Создай план, который поможет клиенту достичь его целей и выделиться среди конкурентов.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 4000
          })
        });

        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', response.status, errorText);
          throw new Error(`API ошибка: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
          console.error('❌ No content in API response');
          throw new Error('Пустой ответ от API');
        }

        console.log('✅ Content plan generated successfully');
        console.log('📋 Content plan length:', content.length);
        console.log('📋 Content plan preview:', content.substring(0, 1000) + '...');
        
        contentPlan = this.parseContentPlanResponse(content);
      } catch (error) {
        console.error('❌ Error generating content plan:', error);
        contentPlan = this.generateLocalContentPlan(userAnswers);
      }
    }

    // Автоматически сохраняем сгенерированный план
    try {
      const platforms = Array.isArray(userAnswers.platforms) ? userAnswers.platforms : ['TikTok'];
      const goals = Array.isArray(userAnswers.goals) ? userAnswers.goals : ['Увеличить вовлеченность'];
      
      const title = `Контент-план для ${platforms.join(', ')}`;
      const description = `Стратегия развития в ${platforms.join(', ')} с фокусом на ${goals.join(', ')}`;
      const tags = [...platforms, ...goals.map(goal => goal.toLowerCase())];
      
      const savedPlan = contentPlanStorage.savePlan(
        title,
        description,
        userAnswers,
        contentPlan,
        tags
      );
      
      console.log('💾 Content plan saved successfully:', savedPlan.id);
    } catch (error) {
      console.error('❌ Error saving content plan:', error);
    }

    return contentPlan;
  }

  private createStructuredResponse(content: string): AIInsights {
    // Извлекаем ключевую информацию из текстового ответа
    const context = content.includes('контекст') ? content.split('контекст')[1]?.split('.')[0] : 'Уникальный видеоконтент';
    const theme = content.includes('тема') ? content.split('тема')[1]?.split('.')[0] : 'Креативный контент';
    
    return {
      context: context || 'Уникальный видеоконтент',
      theme: theme || 'Креативный контент',
      targetAudience: 'Целевая аудитория',
      videoPersonality: 'Динамичный и увлекательный',
      strengths: ['Хорошее качество', 'Интересный контент'],
      weaknesses: ['Можно улучшить'],
      opportunities: ['Большой потенциал'],
      uniqueRecommendations: ['Добавьте креативности', 'Используйте новые ракурсы'],
      personalizedTips: ['Используйте тренды', 'Экспериментируйте'],
      creativeSuggestions: ['Попробуйте что-то новое', 'Создайте уникальный стиль']
    };
  }

  private createAdvancedPrompt(videoData: VideoAnalysisData): string {
    const emotionAnalysis = this.analyzeEmotions(videoData.emotionStats);
    const objectAnalysis = this.analyzeObjects(videoData.objectStats);
    const colorAnalysis = this.analyzeColors(videoData.colorStats);
    const compositionAnalysis = this.analyzeComposition(videoData.compositionStats);
    const movementAnalysis = this.analyzeMovement(videoData.movementStats);
    const lightingAnalysis = this.analyzeLighting(videoData.lightingStats);
    const qualityAnalysis = this.analyzeQuality(videoData);
    const contentAnalysis = this.analyzeContent(videoData);
    
    // Детальный анализ технических параметров
    const technicalAnalysis = this.analyzeTechnicalDetails(videoData);
    
    return `
🎬 ПРОФЕССИОНАЛЬНЫЙ АНАЛИЗ ВИДЕО ДЛЯ СОЗДАНИЯ УНИКАЛЬНЫХ СОВЕТОВ

📊 ОСНОВНЫЕ МЕТРИКИ:
• Длительность: ${videoData.totalFrames} кадров (${Math.round(videoData.totalFrames/30)} сек)
• Оценка качества: ${videoData.qualityScore}/100
• Потенциал вовлеченности: ${videoData.engagementScore}/100
• Тип контента: ${videoData.contentType}
• Целевая платформа: ${videoData.platform}

🎭 ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ ЭМОЦИЙ:
${emotionAnalysis}

🎨 ВИЗУАЛЬНЫЙ АНАЛИЗ ОБЪЕКТОВ:
${objectAnalysis}

🌈 ЦВЕТОВАЯ ПСИХОЛОГИЯ:
${colorAnalysis}

📐 КОМПОЗИЦИОННЫЙ АНАЛИЗ:
${compositionAnalysis}

🎬 ДИНАМИЧЕСКИЙ АНАЛИЗ ДВИЖЕНИЯ:
${movementAnalysis}

💡 АНАЛИЗ ОСВЕЩЕНИЯ И АТМОСФЕРЫ:
${lightingAnalysis}

📐 ТЕХНИЧЕСКИЙ АНАЛИЗ КАЧЕСТВА:
${qualityAnalysis}

🎬 КОНТЕНТНЫЙ АНАЛИЗ:
${contentAnalysis}

🔬 ДЕТАЛЬНЫЙ ТЕХНИЧЕСКИЙ АНАЛИЗ:
${technicalAnalysis}

📝 ТЕКСТОВЫЙ КОНТЕНТ:
${videoData.ocrTexts.length > 0 ? videoData.ocrTexts.slice(0, 3).join(' | ') : 'Текст не обнаружен'}

🎯 ЗАДАЧА: Ты эксперт по созданию вирусного контента с 15-летним опытом. Проанализируй это видео и создай уникальный, персонализированный анализ в формате JSON:

{
  "context": "креативное и детальное описание происходящего в видео с учетом всех визуальных элементов",
  "theme": "глубокая идея/тема видео с учетом психологии восприятия",
  "targetAudience": "точная целевая аудитория с учетом демографии и психографии",
  "videoPersonality": "уникальная личность/характер видео, который выделяет его среди других",
  "strengths": ["3-4 сильные стороны с конкретными примерами из анализа"],
  "weaknesses": ["3-4 слабые стороны с объяснением их влияния"],
  "opportunities": ["3-4 уникальные возможности для роста и развития"],
  "uniqueRecommendations": ["5-7 креативных, неожиданных советов, которые удивят клиента"],
  "personalizedTips": ["5-7 персонализированных советов с учетом всех деталей анализа"],
  "creativeSuggestions": ["3-4 инновационные идеи для улучшения, которые выделят видео"]
}

🎨 КРЕАТИВНЫЕ ПРАВИЛА:
1. Каждый совет должен быть уникальным для этого конкретного видео
2. Используй данные о цветах для создания эмоционального воздействия
3. Учитывай композицию для улучшения визуального восприятия
4. Анализируй движение для создания динамики
5. Думай как успешный контент-мейкер с миллионами подписчиков
6. Создавай советы, которые заставят видео выделиться среди миллионов других
7. Используй психологию восприятия и современные тренды
8. Будь максимально креативным, но практичным
9. Каждый совет должен быть конкретным и выполнимым
10. Удиви клиента неожиданными, но эффективными идеями
11. Учитывай технические параметры для создания профессиональных советов
12. Дай советы, которые действительно работают в реальном мире
`;
  }

  private analyzeEmotions(emotionStats: Record<string, number>): string {
    const total = Object.values(emotionStats).reduce((a, b) => a + b, 0);
    const emotions = Object.entries(emotionStats)
      .sort((a, b) => b[1] - a[1])
      .map(([emotion, count]) => `${emotion}: ${Math.round(count/total*100)}%`)
      .join(', ');
    
    const dominant = Object.entries(emotionStats).sort((a, b) => b[1] - a[1])[0];
    
    let analysis = `Доминирующая эмоция: ${dominant?.[0] || 'нейтральная'}\n`;
    analysis += `Распределение: ${emotions}\n`;
    
    if (emotionStats.happy > emotionStats.sad) {
      analysis += '✅ Позитивный тон преобладает';
    } else if (emotionStats.sad > emotionStats.happy) {
      analysis += '⚠️ Преобладают грустные эмоции';
    } else {
      analysis += '😐 Нейтральный эмоциональный тон';
    }
    
    return analysis;
  }

  private analyzeObjects(objectStats: Record<string, number>): string {
    const objects = Object.entries(objectStats)
      .sort((a, b) => b[1] - a[1])
      .map(([obj, count]) => `${obj} (${count} кадров)`)
      .join(', ');
    
    let analysis = `Обнаруженные объекты: ${objects}\n`;
    
    if (objectStats.person) {
      analysis += '👥 Человеческий элемент присутствует\n';
    }
    if (objectStats.sky) {
      analysis += '🌤️ Уличные сцены\n';
    }
    if (objectStats.vegetation) {
      analysis += '🌿 Природные элементы\n';
    }
    
    const diversity = Object.keys(objectStats).length;
    if (diversity < 3) {
      analysis += '⚠️ Мало разнообразия в кадре';
    } else {
      analysis += '✅ Хорошее разнообразие объектов';
    }
    
    return analysis;
  }

  private analyzeColors(colorStats: Record<string, number>): string {
    if (Object.keys(colorStats).length === 0) {
      return "Цветовой анализ недоступен";
    }
    
    const sortedColors = Object.entries(colorStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const colorNames: Record<string, string> = {
      red: 'красный',
      green: 'зеленый',
      blue: 'синий',
      neutral: 'нейтральный'
    };
    
    return sortedColors.map(([color, count]) => 
      `- ${colorNames[color] || color}: ${count} кадров`
    ).join('\n');
  }

  private analyzeComposition(compositionStats: { ruleOfThirds: number; symmetry: number; depth: number }): string {
    const total = compositionStats.ruleOfThirds + compositionStats.symmetry + compositionStats.depth;
    if (total === 0) return "Композиционный анализ недоступен";
    
    const ruleOfThirdsPercent = Math.round((compositionStats.ruleOfThirds / total) * 100);
    const symmetryPercent = Math.round((compositionStats.symmetry / total) * 100);
    const depthPercent = Math.round((compositionStats.depth / total) * 100);
    
    return `- Правило третей: ${ruleOfThirdsPercent}%\n- Симметрия: ${symmetryPercent}%\n- Глубина: ${depthPercent}%`;
  }

  private analyzeMovement(movementStats: { static: number; slight: number; dynamic: number }): string {
    const total = movementStats.static + movementStats.slight + movementStats.dynamic;
    if (total === 0) return "Анализ движения недоступен";
    
    const staticPercent = Math.round((movementStats.static / total) * 100);
    const slightPercent = Math.round((movementStats.slight / total) * 100);
    const dynamicPercent = Math.round((movementStats.dynamic / total) * 100);
    
    let movementType = "статичное";
    if (dynamicPercent > 50) movementType = "динамичное";
    else if (slightPercent > 30) movementType = "умеренно подвижное";
    
    return `- Статичные кадры: ${staticPercent}%\n- Легкое движение: ${slightPercent}%\n- Динамичные кадры: ${dynamicPercent}%\n- Тип: ${movementType}`;
  }

  private analyzeLighting(lightingStats: { dark: number; good: number; bright: number }): string {
    const total = lightingStats.dark + lightingStats.good + lightingStats.bright;
    if (total === 0) return "Анализ освещения недоступен";
    
    const darkPercent = Math.round((lightingStats.dark / total) * 100);
    const goodPercent = Math.round((lightingStats.good / total) * 100);
    const brightPercent = Math.round((lightingStats.bright / total) * 100);
    
    let lightingQuality = "хорошее";
    if (darkPercent > 50) lightingQuality = "темное";
    else if (brightPercent > 50) lightingQuality = "яркое";
    
    return `- Темные кадры: ${darkPercent}%\n- Хорошее освещение: ${goodPercent}%\n- Яркие кадры: ${brightPercent}%\n- Качество: ${lightingQuality}`;
  }

  private analyzeQuality(videoData: VideoAnalysisData): string {
    let analysis = '';
    
    if (videoData.blurFrames > videoData.totalFrames * 0.3) {
      analysis += '📸 Проблемы с фокусировкой\n';
    }
    if (videoData.framesWithFaces < videoData.totalFrames * 0.5) {
      analysis += '👤 Мало человеческого элемента\n';
    }
    if (videoData.framesWithText < videoData.totalFrames * 0.2) {
      analysis += '📝 Мало текстового контента\n';
    }
    
    if (videoData.qualityScore > 80) {
      analysis += '✅ Высокое качество видео';
    } else if (videoData.qualityScore > 60) {
      analysis += '⚠️ Среднее качество, есть возможности для улучшения';
    } else {
      analysis += '❌ Низкое качество, требуется серьезная доработка';
    }
    
    return analysis;
  }

  private analyzeContent(videoData: VideoAnalysisData): string {
    let analysis = '';
    
    switch (videoData.contentType) {
      case 'person-focused':
        analysis += '🎭 Фокус на людях и эмоциях\n';
        analysis += '💡 Отлично для личных историй и влогов';
        break;
      case 'text-heavy':
        analysis += '📚 Информационный контент\n';
        analysis += '💡 Подходит для обучения и объяснений';
        break;
      case 'outdoor':
        analysis += '🌍 Уличные/природные сцены\n';
        analysis += '💡 Отлично для путешествий и активностей';
        break;
      default:
        analysis += '🎬 Общий развлекательный контент\n';
        analysis += '💡 Универсальный формат';
    }
    
    if (videoData.platform === 'tiktok') {
      analysis += '📱 Оптимизировано для TikTok';
    } else if (videoData.platform === 'instagram') {
      analysis += '📸 Подходит для Instagram Reels';
    }
    
    return analysis;
  }

  private analyzeTechnicalDetails(videoData: VideoAnalysisData): string {
    const { results, totalFrames, blurFrames } = videoData;
    // Анализ технических параметров
    const focusStats = { excellent: 0, good: 0, fair: 0, poor: 0 };
    const textureStats = { detailed: 0, textured: 0, smooth: 0 };
    const dynamicRangeStats = { high: 0, medium: 0, low: 0 };
    const saturationStats = { high: 0, medium: 0, low: 0 };
    const temperatureStats = { warm: 0, cool: 0, neutral: 0 };
    results.forEach(frame => {
      if (frame.focus) focusStats[frame.focus.quality as keyof typeof focusStats]++;
      if (frame.textures) textureStats[frame.textures.type as keyof typeof textureStats]++;
      if (frame.dynamicRange) dynamicRangeStats[frame.dynamicRange.range as keyof typeof dynamicRangeStats]++;
      if (frame.saturation) saturationStats[frame.saturation.level as keyof typeof saturationStats]++;
      if (frame.colorTemperature) temperatureStats[frame.colorTemperature.temperature as keyof typeof temperatureStats]++;
    });
    let technicalAnalysis = `🔬 ТЕХНИЧЕСКИЙ АНАЛИЗ:\n`;
    // Анализ фокуса
    const dominantFocus = Object.entries(focusStats).sort((a, b) => b[1] - a[1])[0];
    technicalAnalysis += `📸 ФОКУС: ${dominantFocus[0]} (${Math.round(dominantFocus[1]/totalFrames*100)}% кадров)\n`;
    // Анализ текстур
    const dominantTexture = Object.entries(textureStats).sort((a, b) => b[1] - a[1])[0];
    technicalAnalysis += `🎨 ТЕКСТУРЫ: ${dominantTexture[0]} (${Math.round(dominantTexture[1]/totalFrames*100)}% кадров)\n`;
    // Анализ динамического диапазона
    const dominantRange = Object.entries(dynamicRangeStats).sort((a, b) => b[1] - a[1])[0];
    technicalAnalysis += `📊 ДИНАМИЧЕСКИЙ ДИАПАЗОН: ${dominantRange[0]} (${Math.round(dominantRange[1]/totalFrames*100)}% кадров)\n`;
    // Анализ насыщенности
    const dominantSaturation = Object.entries(saturationStats).sort((a, b) => b[1] - a[1])[0];
    technicalAnalysis += `🌈 НАСЫЩЕННОСТЬ: ${dominantSaturation[0]} (${Math.round(dominantSaturation[1]/totalFrames*100)}% кадров)\n`;
    // Анализ цветовой температуры
    const dominantTemperature = Object.entries(temperatureStats).sort((a, b) => b[1] - a[1])[0];
    technicalAnalysis += `🌡️ ЦВЕТОВАЯ ТЕМПЕРАТУРА: ${dominantTemperature[0]} (${Math.round(dominantTemperature[1]/totalFrames*100)}% кадров)\n`;
    // Анализ размытия
    const blurPercentage = Math.round(blurFrames/totalFrames*100);
    technicalAnalysis += `📉 РАЗМЫТИЕ: ${blurPercentage}% кадров имеют низкое качество\n`;
    return technicalAnalysis;
  }

  private validateAdvancedInsights(insights: any): AIInsights {
    return {
      context: insights.context || 'Уникальный видеоконтент',
      theme: insights.theme || 'Креативный контент',
      targetAudience: insights.targetAudience || 'Целевая аудитория',
      videoPersonality: insights.videoPersonality || 'Динамичный и увлекательный',
      strengths: Array.isArray(insights.strengths) ? insights.strengths : ['Хорошее качество'],
      weaknesses: Array.isArray(insights.weaknesses) ? insights.weaknesses : ['Можно улучшить'],
      opportunities: Array.isArray(insights.opportunities) ? insights.opportunities : ['Большой потенциал'],
      uniqueRecommendations: Array.isArray(insights.uniqueRecommendations) ? insights.uniqueRecommendations : ['Добавьте креативности'],
      personalizedTips: Array.isArray(insights.personalizedTips) ? insights.personalizedTips : ['Используйте тренды'],
      creativeSuggestions: Array.isArray(insights.creativeSuggestions) ? insights.creativeSuggestions : ['Попробуйте что-то новое']
    };
  }

  private generateAdvancedLocalInsights(videoData: VideoAnalysisData): AIInsights {
    const { contentType, platform, uniqueObjects, emotionStats, qualityScore, engagementScore, totalFrames, blurFrames, framesWithFaces } = videoData;
    
    // Создаем уникальный контекст на основе анализа
    let context = this.generateUniqueContext(videoData);
    let theme = this.generateUniqueTheme(videoData);
    let targetAudience = this.generateTargetAudience(videoData);
    let videoPersonality = this.generateVideoPersonality(videoData);
    
    const strengths = this.generateStrengths(videoData);
    const weaknesses = this.generateWeaknesses(videoData);
    const opportunities = this.generateOpportunities(videoData);
    const uniqueRecommendations = this.generateUniqueRecommendations(videoData);
    const personalizedTips = this.generatePersonalizedTips(videoData);
    const creativeSuggestions = this.generateCreativeSuggestions(videoData);

    return {
      context,
      theme,
      targetAudience,
      videoPersonality,
      strengths,
      weaknesses,
      opportunities,
      uniqueRecommendations,
      personalizedTips,
      creativeSuggestions
    };
  }

  private generateUniqueContext(videoData: VideoAnalysisData): string {
    const { contentType, platform, uniqueObjects, emotionStats, totalFrames, colorStats, movementStats, lightingStats } = videoData;
    
    // Анализируем цветовую палитру
    const dominantColor = Object.entries(colorStats).sort((a, b) => b[1] - a[1])[0]?.[0];
    const isDynamic = movementStats.dynamic > movementStats.static;
    const isBright = lightingStats.bright > lightingStats.dark;
    
    if (contentType === 'person-focused' && emotionStats.happy > emotionStats.sad) {
      return isDynamic ? 'Динамичный позитивный влог с яркими эмоциями' : 'Теплый позитивный влог с человеческим элементом';
    } else if (contentType === 'person-focused' && emotionStats.sad > emotionStats.happy) {
      return 'Эмоциональная история с глубоким личным содержанием';
    } else if (uniqueObjects.includes('sky') && uniqueObjects.includes('vegetation')) {
      return dominantColor === 'green' ? 'Природный контент с зелеными пейзажами' : 'Уличные сцены с природными элементами';
    } else if (uniqueObjects.includes('person') && totalFrames < 180) {
      return isDynamic ? 'Короткий динамичный контент с движением' : 'Компактный контент с человеческим элементом';
    } else if (isBright && dominantColor === 'blue') {
      return 'Яркий контент с синими тонами и хорошим освещением';
    } else {
      return 'Уникальный видеоконтент с собственным стилем';
    }
  }

  private generateUniqueTheme(videoData: VideoAnalysisData): string {
    const { contentType, platform, uniqueObjects } = videoData;
    
    if (contentType === 'person-focused') {
      return 'Человеческие истории и эмоциональные связи';
    } else if (uniqueObjects.includes('sky') && uniqueObjects.includes('vegetation')) {
      return 'Природная красота и уличные приключения';
    } else if (platform === 'tiktok') {
      return 'Трендовый короткий контент для быстрого потребления';
    } else {
      return 'Креативное самовыражение через видео';
    }
  }

  private generateTargetAudience(videoData: VideoAnalysisData): string {
    const { contentType, platform, emotionStats } = videoData;
    
    if (contentType === 'person-focused' && emotionStats.happy > emotionStats.sad) {
      return 'Молодые люди, ищущие позитива и вдохновения';
    } else if (contentType === 'person-focused' && emotionStats.sad > emotionStats.happy) {
      return 'Люди, ценящие глубину и эмоциональные истории';
    } else if (platform === 'tiktok') {
      return 'Поколение Z, любящее быстрые тренды';
    } else {
      return 'Широкая аудитория, интересующаяся качественным контентом';
    }
  }

  private generateVideoPersonality(videoData: VideoAnalysisData): string {
    const { emotionStats, qualityScore, engagementScore } = videoData;
    
    if (emotionStats.happy > emotionStats.sad && qualityScore > 80) {
      return 'Яркий, позитивный и профессиональный';
    } else if (emotionStats.sad > emotionStats.happy) {
      return 'Глубокий, эмоциональный и задумчивый';
    } else if (engagementScore > 70) {
      return 'Динамичный, увлекательный и интерактивный';
    } else {
      return 'Спокойный, созерцательный и медитативный';
    }
  }

  private generateStrengths(videoData: VideoAnalysisData): string[] {
    const strengths: string[] = [];
    const { emotionStats, qualityScore, engagementScore, uniqueObjects } = videoData;
    
    if (emotionStats.happy > emotionStats.sad) {
      strengths.push('Позитивная энергетика привлекает аудиторию');
    }
    if (qualityScore > 80) {
      strengths.push('Высокое техническое качество видео');
    }
    if (engagementScore > 70) {
      strengths.push('Отличная вовлеченность зрителей');
    }
    if (uniqueObjects.includes('person')) {
      strengths.push('Человеческий элемент создает эмоциональную связь');
    }
    if (uniqueObjects.length > 3) {
      strengths.push('Богатое визуальное разнообразие');
    }
    
    return strengths.length > 0 ? strengths : ['Уникальный стиль и подход'];
  }

  private generateWeaknesses(videoData: VideoAnalysisData): string[] {
    const weaknesses: string[] = [];
    const { blurFrames, totalFrames, framesWithFaces, emotionStats } = videoData;
    
    if (blurFrames > totalFrames * 0.3) {
      weaknesses.push('Проблемы с фокусировкой снижают качество');
    }
    if (framesWithFaces < totalFrames * 0.5) {
      weaknesses.push('Недостаточно человеческого элемента');
    }
    if (emotionStats.sad > emotionStats.happy) {
      weaknesses.push('Грустный тон может снизить вовлеченность');
    }
    
    return weaknesses.length > 0 ? weaknesses : ['Есть возможности для роста'];
  }

  private generateOpportunities(videoData: VideoAnalysisData): string[] {
    const opportunities: string[] = [];
    const { platform, contentType, uniqueObjects } = videoData;
    
    if (platform === 'tiktok') {
      opportunities.push('Потенциал для вирусного распространения');
    }
    if (contentType === 'person-focused') {
      opportunities.push('Возможность создать личный бренд');
    }
    if (uniqueObjects.includes('sky')) {
      opportunities.push('Потенциал для travel-контента');
    }
    
    return opportunities.length > 0 ? opportunities : ['Большие возможности для роста'];
  }

  private generateUniqueRecommendations(videoData: VideoAnalysisData): string[] {
    const recommendations: string[] = [];
    const { contentType, platform, emotionStats, qualityScore, uniqueObjects, colorStats, movementStats, lightingStats, compositionStats } = videoData;
    
    // Креативный анализ цветов
    const dominantColor = Object.entries(colorStats).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominantColor === 'neutral') {
      recommendations.push('🎨 Создайте цветовой взрыв: добавьте неоновые акценты для мгновенного привлечения внимания');
    } else if (dominantColor === 'red') {
      recommendations.push('🔥 Используйте красный как эмоциональный триггер: создайте моменты напряжения и страсти');
    } else if (dominantColor === 'blue') {
      recommendations.push('🌊 Синий создает доверие: используйте его для создания ощущения стабильности и профессионализма');
    } else if (dominantColor === 'green') {
      recommendations.push('🌿 Зеленый успокаивает: создайте моменты релаксации и природной гармонии');
    }
    
    // Инновационный анализ движения
    if (movementStats.static > movementStats.dynamic) {
      recommendations.push('⚡ Добавьте кинематографическую динамику: используйте плавные движения камеры и неожиданные ракурсы');
    } else if (movementStats.dynamic > movementStats.static * 2) {
      recommendations.push('🎯 Создайте моменты покоя: добавьте статичные кадры для эмоционального воздействия и баланса');
    }
    
    // Креативный анализ освещения
    if (lightingStats.dark > lightingStats.good) {
      recommendations.push('✨ Создайте драматическое освещение: используйте контрастные тени для создания настроения и глубины');
    } else if (lightingStats.bright > lightingStats.good) {
      recommendations.push('🌟 Добавьте объемное освещение: создайте тени и блики для трехмерного эффекта');
    }
    
    // Инновационный анализ композиции
    if (compositionStats.ruleOfThirds < compositionStats.symmetry) {
      recommendations.push('📐 Разрушьте симметрию: используйте правило третей для создания динамики и визуального интереса');
    }
    
    // Психологический анализ эмоций
    if (contentType === 'person-focused' && emotionStats.happy > emotionStats.sad) {
      recommendations.push('😊 Создайте эмоциональные пики: добавьте крупные планы искренних улыбок и моментов радости');
      recommendations.push('🎬 Используйте кинематографические переходы: создайте плавные переходы между эмоциональными сценами');
    } else if (contentType === 'person-focused' && emotionStats.sad > emotionStats.happy) {
      recommendations.push('💫 Добавьте моменты катарсиса: создайте эмоциональные кульминации и моменты надежды');
      recommendations.push('🕯️ Используйте теплое освещение: создайте ощущение близости и человечности');
    }
    
    // Платформенная оптимизация
    if (platform === 'tiktok') {
      recommendations.push('⚡ Создайте взрывной хук: первые 2 секунды должны шокировать и зацепить зрителя');
      recommendations.push('🎵 Добавьте вирусные звуки: используйте трендовые треки и звуковые эффекты');
      recommendations.push('🔄 Создайте повторяемость: добавьте элементы, которые зрители захотят пересмотреть');
    } else if (platform === 'instagram') {
      recommendations.push('📱 Оптимизируйте для квадрата: создайте композицию, которая работает в разных форматах');
      recommendations.push('💎 Добавьте премиум-эффекты: используйте качественные переходы и визуальные эффекты');
    } else if (platform === 'youtube') {
      recommendations.push('🎯 Создайте долгосрочную вовлеченность: добавьте элементы, которые удержат зрителя до конца');
      recommendations.push('📈 Используйте аналитику: создайте контент, который понравится алгоритму YouTube');
    }
    
    // Уникальные креативные советы
    if (uniqueObjects.includes('person')) {
      recommendations.push('👁️ Создайте зрительный контакт: используйте крупные планы глаз для эмоциональной связи');
    }
    if (uniqueObjects.includes('sky')) {
      recommendations.push('☁️ Используйте небо как эмоциональный фон: создайте контраст между земным и возвышенным');
    }
    if (uniqueObjects.includes('vegetation')) {
      recommendations.push('🌱 Создайте метафоры роста: используйте природу как символ развития и изменений');
    }
    
    return recommendations.length > 0 ? recommendations : [
      '🎨 Создайте уникальный визуальный стиль: экспериментируйте с цветами, композицией и движением',
      '⚡ Добавьте элемент неожиданности: создайте моменты, которые удивят и зацепят зрителя',
      '💫 Используйте психологию восприятия: создайте контент, который воздействует на эмоции зрителя'
    ];
  }

  private generatePersonalizedTips(videoData: VideoAnalysisData): string[] {
    const tips: string[] = [];
    const { platform, contentType, emotionStats, uniqueObjects, colorStats, movementStats } = videoData;
    
    // Платформенная персонализация
    if (platform === 'tiktok') {
      tips.push('🎵 Используйте вирусные звуки: добавьте трендовые треки и звуковые эффекты');
      tips.push('⚡ Создайте серию связанных видео: используйте cliffhangers для удержания аудитории');
      tips.push('🔄 Участвуйте в челленджах: создайте собственный уникальный тренд');
    } else if (platform === 'instagram') {
      tips.push('📱 Создайте Instagram Stories: добавьте интерактивные элементы и опросы');
      tips.push('💎 Используйте Reels: создайте вертикальный контент с музыкой');
      tips.push('🎨 Добавьте IGTV: создайте длинный контент для глубокого погружения');
    } else if (platform === 'youtube') {
      tips.push('📈 Оптимизируйте для SEO: используйте ключевые слова в заголовках');
      tips.push('🎯 Создайте плейлисты: группируйте связанные видео для удержания аудитории');
      tips.push('💬 Включите интерактивные элементы: карточки, конечные экраны, опросы');
    }
    
    // Персонализация по типу контента
    if (contentType === 'person-focused') {
      tips.push('👤 Покажите закулисье: создайте ощущение близости с аудиторией');
      tips.push('💭 Добавьте личные истории: используйте эмоциональные моменты и анекдоты');
      tips.push('🎭 Создайте персонажа: развивайте уникальную личность для вашего бренда');
    }
    
    // Персонализация по визуальным элементам
    if (uniqueObjects.includes('sky')) {
      tips.push('🌅 Используйте golden hour: создайте волшебное освещение для эмоционального воздействия');
      tips.push('👥 Добавьте людей в пейзажи: создайте масштаб и человеческий элемент');
      tips.push('☁️ Создайте time-lapse: покажите динамику природы и времени');
    }
    
    // Персонализация по цветам
    const dominantColor = Object.entries(colorStats).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominantColor === 'neutral') {
      tips.push('🎨 Добавьте цветовые акценты: используйте яркие цвета для привлечения внимания');
    } else if (dominantColor === 'blue') {
      tips.push('🌊 Используйте синий стратегически: создайте ощущение доверия и стабильности');
    }
    
    // Персонализация по движению
    if (movementStats.static > movementStats.dynamic) {
      tips.push('⚡ Добавьте динамику: используйте движения камеры для создания энергии');
    } else if (movementStats.dynamic > movementStats.static * 2) {
      tips.push('🎯 Создайте моменты покоя: добавьте статичные кадры для эмоционального воздействия');
    }
    
    return tips.length > 0 ? tips : [
      '📊 Анализируйте тренды: следите за популярными темами в вашей нише',
      '🎯 Изучайте аудиторию: понимайте, что нравится вашим подписчикам',
      '💡 Экспериментируйте: пробуйте новые форматы и техники'
    ];
  }

  private generateCreativeSuggestions(videoData: VideoAnalysisData): string[] {
    const suggestions: string[] = [];
    const { contentType, platform, uniqueObjects, emotionStats, colorStats, movementStats } = videoData;
    
    // Креативные идеи по типу контента
    if (contentType === 'person-focused') {
      suggestions.push('🎬 Создайте серию "День из жизни": покажите реальные моменты и эмоции');
      suggestions.push('💬 Попробуйте формат Q&A: отвечайте на вопросы подписчиков в видео');
      suggestions.push('🎭 Создайте персонажа: развивайте уникальную личность для вашего бренда');
      suggestions.push('📱 Снимите реакцию на тренды: покажите свое мнение на популярные темы');
    }
    
    // Креативные идеи по визуальным элементам
    if (uniqueObjects.includes('sky')) {
      suggestions.push('☁️ Создайте time-lapse с облаками: покажите динамику природы');
      suggestions.push('🌍 Снимите видео о путешествиях: покажите разные места и культуры');
      suggestions.push('🌅 Создайте серию "Небеса мира": покажите небо в разных городах');
      suggestions.push('🌤️ Снимите погодные изменения: покажите красоту природы в разную погоду');
    }
    
    // Креативные идеи по платформам
    if (platform === 'tiktok') {
      suggestions.push('🔥 Участвуйте в челленджах: создайте собственный уникальный тренд');
      suggestions.push('🎵 Создайте звуковой брендинг: разработайте уникальную музыку для видео');
      suggestions.push('⚡ Создайте серию "Быстрые советы": короткие полезные видео');
      suggestions.push('🔄 Снимите "До и после": покажите трансформации и изменения');
    } else if (platform === 'instagram') {
      suggestions.push('📸 Создайте фото-серию: дополните видео статичными изображениями');
      suggestions.push('🎨 Снимите процесс создания: покажите, как создается контент');
      suggestions.push('💎 Создайте премиум-контент: используйте высокое качество и стиль');
    } else if (platform === 'youtube') {
      suggestions.push('📚 Создайте обучающую серию: делитесь знаниями и опытом');
      suggestions.push('🎯 Снимите обзоры: анализируйте продукты, места или события');
      suggestions.push('💬 Создайте дискуссионный формат: обсуждайте актуальные темы');
    }
    
    // Креативные идеи по эмоциям
    if (emotionStats.happy > emotionStats.sad) {
      suggestions.push('😊 Создайте серию "Моменты радости": собирайте позитивные моменты');
      suggestions.push('🎉 Снимите праздничные видео: создайте атмосферу веселья');
      suggestions.push('🌟 Создайте мотивационный контент: вдохновляйте аудиторию');
    } else if (emotionStats.sad > emotionStats.happy) {
      suggestions.push('💫 Создайте серию "Истории надежды": покажите преодоление трудностей');
      suggestions.push('🕯️ Снимите медитативные видео: создайте спокойную атмосферу');
      suggestions.push('🌱 Создайте контент о росте: покажите развитие и изменения');
    }
    
    // Креативные идеи по цветам
    const dominantColor = Object.entries(colorStats).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominantColor === 'neutral') {
      suggestions.push('🎨 Создайте цветовую серию: экспериментируйте с разными палитрами');
      suggestions.push('🌈 Снимите радужные видео: используйте все цвета спектра');
    } else if (dominantColor === 'blue') {
      suggestions.push('🌊 Создайте морскую серию: используйте синие тона и водные элементы');
      suggestions.push('💙 Снимите спокойные видео: создайте атмосферу умиротворения');
    }
    
    // Креативные идеи по движению
    if (movementStats.static > movementStats.dynamic) {
      suggestions.push('⚡ Создайте динамичную серию: добавьте больше движения и энергии');
      suggestions.push('🎬 Снимите экшн-видео: покажите активность и действие');
    } else if (movementStats.dynamic > movementStats.static * 2) {
      suggestions.push('🎯 Создайте созерцательную серию: добавьте моменты покоя и размышлений');
      suggestions.push('🕊️ Снимите медитативные видео: покажите спокойствие и гармонию');
    }
    
    return suggestions.length > 0 ? suggestions : [
      '🎨 Создайте уникальный стиль: экспериментируйте с визуальными эффектами',
      '🎭 Попробуйте новые жанры: выйдите из зоны комфорта',
      '💡 Создайте инновационный формат: придумайте что-то совершенно новое',
      '🌟 Снимите вдохновляющий контент: мотивируйте и вдохновляйте других'
    ];
  }

  private createContentPlanPrompt(userAnswers: UserAnswers): string {
    const goals = Array.isArray(userAnswers.goals) ? userAnswers.goals : [];
    const audience = typeof userAnswers.targetAudience === 'string' ? userAnswers.targetAudience : '';
    const platforms = Array.isArray(userAnswers.platforms) ? userAnswers.platforms : [];
    const contentType = typeof userAnswers.contentType === 'string' ? userAnswers.contentType : '';
    const style = typeof userAnswers.style === 'string' ? userAnswers.style : '';
    const budget = typeof userAnswers.budget === 'string' ? userAnswers.budget : '';
    const timeline = typeof userAnswers.timeline === 'string' ? userAnswers.timeline : '';
    const experience = typeof userAnswers.experience === 'string' ? userAnswers.experience : '';

    const daysCount = timeline === '1 неделя' ? 7 : timeline === '1 месяц' ? 30 : 90;

    return `Создай контент-план для социальных сетей на основе ответов клиента.

ЦЕЛИ КЛИЕНТА: ${goals.join(', ')}
ЦЕЛЕВАЯ АУДИТОРИЯ: ${audience}
ПЛАТФОРМЫ: ${platforms.join(', ')}
ТИП КОНТЕНТА: ${contentType}
СТИЛЬ КОНТЕНТА: ${style}
БЮДЖЕТ: ${budget}
СРОК: ${timeline}
ОПЫТ: ${experience}

Создай расписание на ${daysCount} дней в следующем формате:

День 1
Тема: [краткое название темы видео]
Что видео должно показать: [описание что именно показывать в видео]
Хук: [как зацепить внимание в первые секунды]
Платформа: [TikTok/Instagram/YouTube]
Длительность: [15 сек/30 сек/1 мин/3 мин]
Хештеги: [#хештег1, #хештег2, #хештег3]

День 2
Тема: [краткое название темы видео]
Что видео должно показать: [описание что именно показывать в видео]
Хук: [как зацепить внимание в первые секунды]
Платформа: [TikTok/Instagram/YouTube]
Длительность: [15 сек/30 сек/1 мин/3 мин]
Хештеги: [#хештег1, #хештег2, #хештег3]

И так далее для всех ${daysCount} дней.

Будь креативным и практичным. Каждое видео должно быть уникальным и соответствовать целям клиента.`;
  }

  private parseContentPlanResponse(content: string): ContentPlan {
    try {
      console.log('🔄 Parsing content plan response...');
      
      // Парсим расписание видео
      const videoSchedule = this.parseVideoSchedule(content);
      console.log('📅 Parsed video schedule:', videoSchedule.length, 'days');
      
      return {
        title: 'Персонализированный контент-план',
        description: 'Стратегия развития в социальных сетях на основе ваших ответов',
        goals: ['Увеличить вовлеченность', 'Расширить аудиторию', 'Повысить узнаваемость'],
        targetAudience: 'Ваша целевая аудитория',
        contentStrategy: 'Смешанная стратегия с акцентом на визуальный контент',
        platformStrategy: {
          TikTok: {
            contentTypes: ['Короткие видео', 'Тренды', 'Челленджи'],
            postingSchedule: '2-3 раза в день в пиковые часы',
            optimizationTips: ['Используй популярные звуки', 'Создавай короткие видео']
          },
          Instagram: {
            contentTypes: ['Посты', 'Stories', 'Reels'],
            postingSchedule: '1-2 раза в день',
            optimizationTips: ['Используй хештеги', 'Взаимодействуй с аудиторией']
          },
          YouTube: {
            contentTypes: ['Видео', 'Shorts', 'Live стримы'],
            postingSchedule: '2-3 раза в неделю',
            optimizationTips: ['Оптимизируй заголовки', 'Создавай плейлисты']
          }
        },
        videoSchedule,
        contentIdeas: [
          'Дневник из жизни',
          'Обзоры продуктов',
          'Советы и лайфхаки',
          'Закулисный контент',
          'Коллаборации с другими авторами'
        ],
        hashtagStrategy: ['#вашбренд', '#тренд', '#контент', '#соцсети'],
        engagementStrategy: [
          'Отвечай на все комментарии',
          'Проводи опросы в Stories',
          'Создавай интерактивный контент',
          'Организуй конкурсы'
        ],
        measurementMetrics: ['Просмотры', 'Лайки', 'Комментарии', 'Подписчики', 'Вовлеченность'],
        timeline: {
          week1: ['Настройка аккаунтов', 'Создание первого контента', 'Изучение аудитории'],
          week2: ['Публикация контента', 'Анализ метрик', 'Корректировка стратегии'],
          week3: ['Оптимизация контента', 'Создание новых идей', 'Коллаборации'],
          week4: ['Масштабирование успешного контента', 'Планирование следующего месяца', 'Анализ результатов']
        }
      };
    } catch (error) {
      console.error('❌ Error parsing content plan:', error);
      return this.createStructuredContentPlan(content);
    }
  }

  private parseVideoSchedule(content: string): VideoSchedule[] {
    console.log('🔄 Parsing video schedule from content...');
    
    const schedule: VideoSchedule[] = [];
    const lines = content.split('\n');
    
    let currentDay = 0;
    let currentTopic = '';
    let currentWhatToShow = '';
    let currentHook = '';
    let currentPlatform = '';
    let currentDuration = '';
    let currentHashtags: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Ищем начало нового дня
      if (line.match(/^День\s+\d+/)) {
        // Сохраняем предыдущий день если есть
        if (currentDay > 0 && currentTopic) {
          schedule.push({
            day: currentDay,
            topic: currentTopic,
            whatToShow: currentWhatToShow,
            hook: currentHook,
            platform: currentPlatform,
            duration: currentDuration,
            hashtags: currentHashtags
          });
        }
        
        // Начинаем новый день
        const dayMatch = line.match(/День\s+(\d+)/);
        currentDay = dayMatch ? parseInt(dayMatch[1]) : 0;
        currentTopic = '';
        currentWhatToShow = '';
        currentHook = '';
        currentPlatform = '';
        currentDuration = '';
        currentHashtags = [];
        
        console.log(`📅 Found day ${currentDay}`);
      }
      
      // Парсим поля
      if (line.startsWith('Тема:')) {
        currentTopic = line.replace('Тема:', '').trim();
        console.log(`📝 Topic: ${currentTopic}`);
      } else if (line.startsWith('Что видео должно показать:')) {
        currentWhatToShow = line.replace('Что видео должно показать:', '').trim();
        console.log(`🎬 What to show: ${currentWhatToShow}`);
      } else if (line.startsWith('Хук:')) {
        currentHook = line.replace('Хук:', '').trim();
        console.log(`🎣 Hook: ${currentHook}`);
      } else if (line.startsWith('Платформа:')) {
        currentPlatform = line.replace('Платформа:', '').trim();
        console.log(`📱 Platform: ${currentPlatform}`);
      } else if (line.startsWith('Длительность:')) {
        currentDuration = line.replace('Длительность:', '').trim();
        console.log(`⏱️ Duration: ${currentDuration}`);
      } else if (line.startsWith('Хештеги:')) {
        const hashtagsText = line.replace('Хештеги:', '').trim();
        currentHashtags = hashtagsText.split(',').map(tag => tag.trim());
        console.log(`🏷️ Hashtags: ${currentHashtags.join(', ')}`);
      }
    }
    
    // Добавляем последний день
    if (currentDay > 0 && currentTopic) {
      schedule.push({
        day: currentDay,
        topic: currentTopic,
        whatToShow: currentWhatToShow,
        hook: currentHook,
        platform: currentPlatform,
        duration: currentDuration,
        hashtags: currentHashtags
      });
    }
    
    console.log(`✅ Parsed ${schedule.length} days`);
    return schedule;
  }

  private createStructuredContentPlan(content: string): ContentPlan {
    return {
      title: 'Персонализированный контент-план',
      description: 'Стратегия развития в социальных сетях на основе ваших ответов',
      goals: ['Увеличить вовлеченность', 'Расширить аудиторию', 'Повысить узнаваемость'],
      targetAudience: 'Ваша целевая аудитория',
      contentStrategy: 'Смешанная стратегия с акцентом на визуальный контент',
      platformStrategy: {
        TikTok: {
          contentTypes: ['Короткие видео', 'Тренды', 'Челленджи'],
          postingSchedule: '2-3 раза в день в пиковые часы',
          optimizationTips: ['Используй популярные звуки', 'Создавай короткие видео']
        },
        Instagram: {
          contentTypes: ['Посты', 'Stories', 'Reels'],
          postingSchedule: '1-2 раза в день',
          optimizationTips: ['Используй хештеги', 'Взаимодействуй с аудиторией']
        },
        YouTube: {
          contentTypes: ['Видео', 'Shorts', 'Live стримы'],
          postingSchedule: '2-3 раза в неделю',
          optimizationTips: ['Оптимизируй заголовки', 'Создавай плейлисты']
        }
      },
      videoSchedule: this.generateLocalVideoSchedule({}),
      contentIdeas: [
        'Дневник из жизни',
        'Обзоры продуктов',
        'Советы и лайфхаки',
        'Закулисный контент',
        'Коллаборации с другими авторами'
      ],
      hashtagStrategy: ['#вашбренд', '#тренд', '#контент', '#соцсети'],
      engagementStrategy: [
        'Отвечай на все комментарии',
        'Проводи опросы в Stories',
        'Создавай интерактивный контент',
        'Организуй конкурсы'
      ],
      measurementMetrics: ['Просмотры', 'Лайки', 'Комментарии', 'Подписчики', 'Вовлеченность'],
      timeline: {
        week1: ['Настройка аккаунтов', 'Создание первого контента', 'Изучение аудитории'],
        week2: ['Публикация контента', 'Анализ метрик', 'Корректировка стратегии'],
        week3: ['Оптимизация контента', 'Создание новых идей', 'Коллаборации'],
        week4: ['Масштабирование успешного контента', 'Планирование следующего месяца', 'Анализ результатов']
      }
    };
  }

  private generateLocalContentPlan(userAnswers: UserAnswers): ContentPlan {
    console.log('🔄 Generating local content plan...');
    
    const goals = Array.isArray(userAnswers.goals) ? userAnswers.goals : ['Увеличить вовлеченность'];
    const platforms = Array.isArray(userAnswers.platforms) ? userAnswers.platforms : ['TikTok'];
    const contentType = typeof userAnswers.contentType === 'string' ? userAnswers.contentType : 'Видео контент';
    
    return {
      title: 'Персонализированный контент-план',
      description: `Стратегия развития в ${platforms.join(', ')} на основе ваших целей`,
      goals: goals.length > 0 ? goals : ['Увеличить вовлеченность', 'Расширить аудиторию'],
      targetAudience: typeof userAnswers.targetAudience === 'string' ? userAnswers.targetAudience : 'Ваша целевая аудитория',
      contentStrategy: `Стратегия для ${contentType} с акцентом на ${platforms.join(', ')}`,
      platformStrategy: this.generatePlatformStrategy(platforms),
      videoSchedule: this.generateLocalVideoSchedule(userAnswers),
      contentIdeas: this.generateContentIdeas(contentType, platforms),
      hashtagStrategy: ['#вашбренд', '#тренд', '#контент'],
      engagementStrategy: ['Отвечай на комментарии', 'Проводи опросы', 'Создавай интерактивный контент'],
      measurementMetrics: ['Просмотры', 'Лайки', 'Комментарии', 'Подписчики'],
      timeline: this.generateTimeline()
    };
  }

  private generateLocalVideoSchedule(userAnswers: UserAnswers): VideoSchedule[] {
    const platforms = Array.isArray(userAnswers.platforms) ? userAnswers.platforms : ['TikTok'];
    const style = typeof userAnswers.style === 'string' ? userAnswers.style : 'Развлекательный';
    
    // Провокационные и вирусные хуки для максимального вовлечения
    const viralHooks = [
      'Почему ты жирная? Потому что...',
      'Я сделал ей предложение, а она...',
      'Мой парень сказал мне "ты толстая"...',
      'Когда твоя мама узнала что ты...',
      'Почему все девушки выбирают плохих парней?',
      'Я потратил 1000$ на подарок, а она...',
      'Мой бывший написал мне после 2 лет...',
      'Почему парни не любят умных девушек?',
      'Когда твои друзья узнали что ты...',
      'Я показал маме свой TikTok и она...',
      'Почему все хотят быть как я?',
      'Мой парень ревнует к моим подписчикам...',
      'Когда твоя бабушка увидела твой контент...',
      'Почему я бросила работу ради TikTok?',
      'Мой бывший попросил вернуться после...',
      'Почему все девушки хотят быть худыми?',
      'Я рассказала маме о своих доходах...',
      'Когда твои друзья узнали твою зарплату...',
      'Почему парни боятся сильных женщин?',
      'Мой парень сказал что я слишком много снимаю...',
      'Почему все хотят быть популярными?',
      'Я показала папе свой контент и он...',
      'Когда твоя сестра узнала твои просмотры...',
      'Почему все копируют мой стиль?',
      'Мой бывший написал мне в TikTok...',
      'Почему девушки всегда правы?',
      'Я рассказала друзьям о своих планах...',
      'Когда твоя мама увидела твои комментарии...',
      'Почему все хотят быть как ты?'
    ];
    
    const videoTemplates = [
      {
        topic: 'Провокационный вопрос дня',
        whatToShow: 'Задаю провокационный вопрос и показываю реакцию',
        hook: viralHooks[0],
        duration: '30 сек',
        hashtags: ['#провокация', '#вопрос', '#реакция', '#вирус']
      },
      {
        topic: 'История из жизни',
        whatToShow: 'Рассказываю реальную историю с неожиданным поворотом',
        hook: viralHooks[1],
        duration: '45 сек',
        hashtags: ['#история', '#жизнь', '#неожиданно', '#вирус']
      },
      {
        topic: 'Реакция на комментарии',
        whatToShow: 'Читаю и реагирую на провокационные комментарии',
        hook: viralHooks[2],
        duration: '25 сек',
        hashtags: ['#комментарии', '#реакция', '#провокация', '#вирус']
      },
      {
        topic: 'Секреты успеха',
        whatToShow: 'Раскрываю секреты своего успеха в соцсетях',
        hook: viralHooks[3],
        duration: '40 сек',
        hashtags: ['#секреты', '#успех', '#раскрытие', '#вирус']
      },
      {
        topic: 'Правда о популярности',
        whatToShow: 'Говорю правду о том, что значит быть популярным',
        hook: viralHooks[4],
        duration: '35 сек',
        hashtags: ['#правда', '#популярность', '#откровение', '#вирус']
      },
      {
        topic: 'Советы от эксперта',
        whatToShow: 'Дам советы, которые никто не хочет слышать',
        hook: viralHooks[5],
        duration: '30 сек',
        hashtags: ['#советы', '#эксперт', '#правда', '#вирус']
      },
      {
        topic: 'Закулисная правда',
        whatToShow: 'Показываю что происходит за кадром',
        hook: viralHooks[6],
        duration: '50 сек',
        hashtags: ['#закулисье', '#правда', '#реальность', '#вирус']
      }
    ];
    
    return videoTemplates.map((template, index) => {
      const platform = platforms[index % platforms.length];
      const hookIndex = index % viralHooks.length;
      
      return {
        day: index + 1,
        topic: template.topic,
        whatToShow: template.whatToShow,
        hook: viralHooks[hookIndex],
        platform,
        duration: template.duration,
        hashtags: template.hashtags
      };
    });
  }

  private generatePlatformStrategy(platforms: string[]) {
    const strategy: any = {};
    
    platforms.forEach(platform => {
      switch (platform.toLowerCase()) {
        case 'tiktok':
          strategy.TikTok = {
            contentTypes: ['Короткие видео', 'Тренды', 'Челленджи'],
            postingSchedule: '2-3 раза в день',
            optimizationTips: ['Используй популярные звуки', 'Создавай короткие видео']
          };
          break;
        case 'instagram':
          strategy.Instagram = {
            contentTypes: ['Посты', 'Stories', 'Reels'],
            postingSchedule: '1-2 раза в день',
            optimizationTips: ['Используй хештеги', 'Взаимодействуй с аудиторией']
          };
          break;
        case 'youtube':
          strategy.YouTube = {
            contentTypes: ['Видео', 'Shorts', 'Live стримы'],
            postingSchedule: '2-3 раза в неделю',
            optimizationTips: ['Оптимизируй заголовки', 'Создавай плейлисты']
          };
          break;
        default:
          strategy[platform] = {
            contentTypes: ['Контент'],
            postingSchedule: '1 раз в день',
            optimizationTips: ['Изучай аудиторию', 'Анализируй метрики']
          };
      }
    });
    
    return strategy;
  }

  private generateContentIdeas(contentType: string, platforms: string[]): string[] {
    const ideas = [
      'Дневник из жизни',
      'Обзоры продуктов',
      'Советы и лайфхаки',
      'Закулисный контент',
      'Коллаборации с другими авторами'
    ];
    
    if (contentType.toLowerCase().includes('видео')) {
      ideas.push('Туториалы', 'Реакции', 'Челленджи');
    }
    
    if (platforms.some(p => p.toLowerCase().includes('tiktok'))) {
      ideas.push('Трендовые видео', 'Звуковые тренды');
    }
    
    return ideas;
  }

  private generateTimeline() {
    return {
      week1: ['Настройка аккаунтов', 'Создание первого контента', 'Изучение аудитории'],
      week2: ['Публикация контента', 'Анализ метрик', 'Корректировка стратегии'],
      week3: ['Оптимизация контента', 'Создание новых идей', 'Коллаборации'],
      week4: ['Масштабирование успешного контента', 'Планирование следующего месяца', 'Анализ результатов']
    };
  }
}

export const aiService = new AIService(); 