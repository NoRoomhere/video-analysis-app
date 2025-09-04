import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  Bot,
  User,
  Loader2,
  Copy,
  Check,
  Sparkles,
  Target,
  Users,
  Smartphone,
  Calendar,
  TrendingUp,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Play,
  Download
} from 'lucide-react';
import { AIService } from '../../services/aiService';
import { Question, UserAnswers, ContentPlan, AIAssistantState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIChat: React.FC = () => {
  const { t, language } = useLanguage();

  const questions: Question[] = [
    {
      id: 'goals',
      text: t('aiAssistant.questions.goals'),
      type: 'multiple',
      options: [
        t('aiAssistant.options.increaseSubscribers'),
        t('aiAssistant.options.increaseEngagement'),
        t('aiAssistant.options.promoteBrand'),
        t('aiAssistant.options.monetizeContent'),
        t('aiAssistant.options.createCommunity'),
        t('aiAssistant.options.shareKnowledge')
      ],
      required: true,
      category: 'goals'
    },
    {
      id: 'targetAudience',
      text: t('aiAssistant.questions.targetAudience'),
      type: 'text',
      required: true,
      category: 'audience'
    },
    {
      id: 'platforms',
      text: t('aiAssistant.questions.platforms'),
      type: 'multiple',
      options: [
        t('aiAssistant.options.tiktok'),
        t('aiAssistant.options.instagram')
      ],
      required: true,
      category: 'platform'
    },
    {
      id: 'contentType',
      text: t('aiAssistant.questions.contentType'),
      type: 'single',
      options: [
        t('aiAssistant.options.videoContent'),
        t('aiAssistant.options.photoContent'),
        t('aiAssistant.options.textContent'),
        t('aiAssistant.options.mixedContent'),
        t('aiAssistant.options.liveStreams'),
        t('aiAssistant.options.storiesReels')
      ],
      required: true,
      category: 'content'
    },
    {
      id: 'style',
      text: t('aiAssistant.questions.style'),
      type: 'single',
      options: [
        t('aiAssistant.options.entertaining'),
        t('aiAssistant.options.educational'),
        t('aiAssistant.options.inspiring'),
        t('aiAssistant.options.informational'),
        t('aiAssistant.options.personal'),
        t('aiAssistant.options.professional')
      ],
      required: true,
      category: 'style'
    },
    {
      id: 'budget',
      text: t('aiAssistant.questions.budget'),
      type: 'single',
      options: [
        t('aiAssistant.options.minimalBudget'),
        t('aiAssistant.options.basicBudget'),
        t('aiAssistant.options.mediumBudget'),
        t('aiAssistant.options.highBudget'),
        t('aiAssistant.options.unlimitedBudget')
      ],
      required: true,
      category: 'goals'
    },
    {
      id: 'timeline',
      text: t('aiAssistant.questions.timeline'),
      type: 'single',
      options: [
        t('aiAssistant.options.oneWeek'),
        t('aiAssistant.options.oneMonth'),
        t('aiAssistant.options.threeMonths')
      ],
      required: true,
      category: 'goals'
    },
    {
      id: 'experience',
      text: t('aiAssistant.questions.experience'),
      type: 'single',
      options: [
        t('aiAssistant.options.beginner'),
        t('aiAssistant.options.junior'),
        t('aiAssistant.options.middle'),
        t('aiAssistant.options.senior'),
        t('aiAssistant.options.pro')
      ],
      required: true,
      category: 'content'
    }
  ];

  const [mode, setMode] = useState<'assistant' | 'chat'>('assistant');
  const [assistantState, setAssistantState] = useState<AIAssistantState>({
    currentStep: 0,
    totalSteps: questions.length,
    answers: {},
    isGenerating: false,
    contentPlan: null,
    error: null
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: t('aiAssistant.greetings.welcome'),
      timestamp: new Date(),
      suggestions: [
        t('aiAssistant.suggestions.startPlan'),
        t('aiAssistant.suggestions.marketingQuestion'),
        t('aiAssistant.suggestions.contentAdvice')
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = new AIService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAssistantState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleNextStep = () => {
    const currentQuestion = questions[assistantState.currentStep];
    const currentAnswer = assistantState.answers[currentQuestion.id];
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      return;
    }

    if (assistantState.currentStep < questions.length - 1) {
      setAssistantState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    } else {
      generateContentPlan();
    }
  };

  const handlePrevStep = () => {
    if (assistantState.currentStep > 0) {
      setAssistantState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const generateContentPlan = async () => {
    setAssistantState(prev => ({
      ...prev,
      isGenerating: true,
      error: null
    }));

    try {
      const contentPlan = await aiService.generateContentPlan(assistantState.answers);
      setAssistantState(prev => ({
        ...prev,
        contentPlan,
        isGenerating: false
      }));
    } catch (error) {
      setAssistantState(prev => ({
        ...prev,
        error: t('aiAssistant.errors.contentPlan'),
        isGenerating: false
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: t('aiAssistant.responses.default', { question: inputValue }),
        timestamp: new Date(),
        suggestions: [
          t('aiAssistant.suggestions.showAnalytics'),
          t('aiAssistant.suggestions.createPlan'),
          t('aiAssistant.suggestions.analyzeCompetitors')
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === t('aiAssistant.suggestions.startPlan')) {
      setMode('assistant');
    } else {
      setInputValue(suggestion);
    }
  };

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = assistantState.answers[question.id];

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  currentAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-900">{option}</span>
                  {currentAnswer === option && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
              return (
                <label
                  key={option}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={isSelected}
                    onChange={(e) => {
                      const currentArray = Array.isArray(currentAnswer) ? currentAnswer : [];
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...currentArray, option]);
                      } else {
                        handleAnswerChange(question.id, currentArray.filter(item => item !== option));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-900">{option}</span>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentAnswer as string || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={t('aiAssistant.placeholders.answer')}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  const renderContentPlan = (plan: ContentPlan) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h2>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      {/* Goals */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          {t('contentPlan.goals')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.goals.map((goal, index) => (
            <div key={index} className="flex items-center p-3 bg-white rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">{goal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-green-600" />
          {t('contentPlan.targetAudience')}
        </h3>
        <p className="text-gray-700">{plan.targetAudience}</p>
      </div>

      {/* Video Schedule */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-orange-600" />
          {t('contentPlan.videoSchedule')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plan.videoSchedule?.map((schedule, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{t('contentPlan.day')}: {schedule.day}</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">{t('contentPlan.topic')}</h5>
                  <p className="text-sm text-gray-900 font-medium">{schedule.topic}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">{t('contentPlan.whatToShow')}</h5>
                  <p className="text-sm text-gray-900">{schedule.whatToShow}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">{t('contentPlan.hook')}</h5>
                  <p className="text-sm text-gray-900">{schedule.hook}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-1">{t('contentPlan.platform')}</h5>
                    <p className="text-xs text-gray-800 bg-purple-50 px-2 py-1 rounded">{schedule.platform}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-1">{t('contentPlan.duration')}</h5>
                    <p className="text-xs text-gray-800 bg-blue-50 px-2 py-1 rounded">{schedule.duration}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-gray-600 mb-1">{t('contentPlan.hashtags')}</h5>
                  <div className="flex flex-wrap gap-1">
                    {schedule.hashtags.map((hashtag, hashtagIndex) => (
                      <span key={hashtagIndex} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Strategy */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-purple-600" />
          {t('contentPlan.platformStrategy')}
        </h3>
        <div className="space-y-4">
          {Object.entries(plan.platformStrategy).map(([platform, strategy]) => (
            <div key={platform} className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{platform}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">{t('contentPlan.contentTypes')}</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {strategy.contentTypes.map((type, index) => (
                      <li key={index}>• {type}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">{t('contentPlan.postingSchedule')}</h5>
                  <p className="text-sm text-gray-700">{strategy.postingSchedule}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">{t('contentPlan.optimizationTips')}</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {strategy.optimizationTips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Ideas */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-600" />
          {t('contentPlan.contentIdeas')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.contentIdeas.map((idea, index) => (
            <div key={index} className="flex items-center p-3 bg-white rounded-lg">
              <Sparkles className="w-4 h-4 text-yellow-500 mr-3" />
              <span className="text-gray-700">{idea}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
          {t('contentPlan.timeline')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(plan.timeline).map(([week, tasks]) => (
            <div key={week} className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 capitalize">{week}</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            const content = JSON.stringify(plan, null, 2);
            navigator.clipboard.writeText(content);
          }}
          className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Copy className="w-4 h-4 mr-2" />
          {t('contentPlan.copyPlan')}
        </button>
        <button
          onClick={() => {
            const content = JSON.stringify(plan, null, 2);
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'content-plan.json';
            a.click();
          }}
          className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('contentPlan.downloadPlan')}
        </button>
      </div>
    </motion.div>
  );

  if (mode === 'assistant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('aiChat.heading')}</h1>
            </div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {t('aiChat.description')}
            </p>
          </motion.div>

          {/* Assistant Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {assistantState.contentPlan ? (
              <div className="p-8">
                {renderContentPlan(assistantState.contentPlan)}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setAssistantState({
                        currentStep: 0,
                        totalSteps: questions.length,
                        answers: {},
                        isGenerating: false,
                        contentPlan: null,
                        error: null
                      });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    {t('aiChat.createNewPlan')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {t('aiChat.question')} {assistantState.currentStep + 1} {t('aiChat.of')} {questions.length}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(((assistantState.currentStep + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((assistantState.currentStep + 1) / questions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={assistantState.currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      {questions[assistantState.currentStep].text}
                    </h2>
                    {renderQuestion(questions[assistantState.currentStep])}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    disabled={assistantState.currentStep === 0}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('aiChat.back')}
                  </button>

                  {assistantState.isGenerating ? (
                    <div className="flex items-center text-blue-600">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('aiChat.generatingPlan')}
                    </div>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      disabled={
                        !assistantState.answers[questions[assistantState.currentStep].id] ||
                        (Array.isArray(assistantState.answers[questions[assistantState.currentStep].id]) &&
                         assistantState.answers[questions[assistantState.currentStep].id].length === 0)
                      }
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {assistantState.currentStep === questions.length - 1 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {t('aiChat.createPlan')}
                        </>
                      ) : (
                        <>
                          {t('aiChat.next')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {assistantState.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {assistantState.error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mode Switch */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setMode('chat')}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t('aiChat.switchToChat')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('aiMarketingAssistant.heading')}</h1>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {t('aiMarketingAssistant.description')}
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-gradient-to-r from-green-500 to-teal-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.type === 'assistant' && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.type === 'assistant' && message.suggestions && (
                    <div className="mt-3 ml-11 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('aiMarketingAssistant.inputPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('aiMarketingAssistant.smartInsights')}</h3>
            <p className="text-gray-600 text-sm">
              {t('aiMarketingAssistant.smartInsightsDescription')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('aiMarketingAssistant.contentStrategy')}</h3>
            <p className="text-gray-600 text-sm">
              {t('aiMarketingAssistant.contentStrategyDescription')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('aiMarketingAssistant.support')}</h3>
            <p className="text-gray-600 text-sm">
              {t('aiMarketingAssistant.supportDescription')}
            </p>
          </div>
        </motion.div>

        {/* Mode Switch */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setMode('assistant')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t('aiMarketingAssistant.createContentPlan')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;