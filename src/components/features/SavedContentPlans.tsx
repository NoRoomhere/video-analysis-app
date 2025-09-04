import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Star as StarFilled, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  Check,
  X,
  Plus,
  Save
} from 'lucide-react';
import { contentPlanStorage } from '../../services/contentPlanStorage';
import { SavedContentPlan, ContentPlanFilters } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const SavedContentPlans: React.FC = () => {
  const { t } = useLanguage();
  const translate = t as (key: string, params?: any) => string;
  const [plans, setPlans] = useState<SavedContentPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SavedContentPlan[]>([]);
  const [filters, setFilters] = useState<ContentPlanFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SavedContentPlan | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadPlans();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [plans, filters, searchTerm]);

  const loadPlans = () => {
    const allPlans = contentPlanStorage.getAllPlans();
    setPlans(allPlans);
  };

  const loadStats = () => {
    const statsData = contentPlanStorage.getStats();
    setStats(statsData);
  };

  const applyFilters = () => {
    let filtered = contentPlanStorage.searchPlans(filters);
    
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPlans(filtered);
  };

  const handleToggleFavorite = (id: string) => {
    contentPlanStorage.toggleFavorite(id);
    loadPlans();
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот план?')) {
      contentPlanStorage.deletePlan(id);
      loadPlans();
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }
    }
  };

  const handleCopyPlan = async (plan: SavedContentPlan) => {
    try {
      const planData = {
        title: plan.title,
        description: plan.description,
        contentPlan: plan.contentPlan,
        userAnswers: plan.userAnswers
      };
      
      await navigator.clipboard.writeText(JSON.stringify(planData, null, 2));
      setCopiedId(plan.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Ошибка при копировании:', error);
    }
  };

  const handleExportPlans = () => {
    const data = contentPlanStorage.exportPlans();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-plans-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPlans = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      const success = contentPlanStorage.importPlans(content);
      if (success) {
        loadPlans();
        alert('Планы успешно импортированы!');
      } else {
        alert('Ошибка при импорте планов');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPlatformIcons = (platforms: string[]) => {
    return platforms.map(platform => {
      switch (platform.toLowerCase()) {
        case 'tiktok':
          return '🎵';
        case 'instagram':
          return '📷';
        default:
          return '📱';
      }
    }).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-600" />
                {t('savedPlans.title')}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('savedPlans.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPlans}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('common.export')}
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                {t('common.import')}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportPlans}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">{t('savedPlans.totalPlans')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">{t('savedPlans.favorites')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">{t('savedPlans.thisMonth')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">{t('savedPlans.popularPlatform')}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {Object.entries(stats.platformStats || {}).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'Нет данных'}
                </p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('savedPlans.searchPlaceholder')}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {t('common.filters')}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-4 rounded-lg shadow-sm border mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('savedPlans.platforms')}
                    </label>
                    <div className="space-y-2">
                      {['TikTok', 'Instagram'].map(platform => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.platforms?.includes(platform) || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const current = filters.platforms || [];
                              const updated = e.target.checked
                                ? [...current, platform]
                                : current.filter(p => p !== platform);
                              setFilters({ ...filters, platforms: updated });
                            }}
                            className="mr-2"
                          />
                          {platform}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('savedPlans.status')}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.isFavorite === true}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, isFavorite: e.target.checked ? true : undefined })}
                          className="mr-2"
                        />
                        {t('savedPlans.onlyFavorites')}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.actions')}
                    </label>
                    <button
                      onClick={() => setFilters({})}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t('common.resetFilters')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {plan.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleToggleFavorite(plan.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {plan.isFavorite ? (
                        <StarFilled className="w-5 h-5 text-yellow-500 fill-current" />
                      ) : (
                        <Star className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">
                      {getPlatformIcons(Object.keys(plan.contentPlan.platformStrategy))}
                    </span>
                    <span className="text-xs text-gray-500">
                      {plan.contentPlan.videoSchedule.length} {t('savedPlans.videos')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{formatDate(plan.createdAt)}</span>
                    <span>{plan.tags.slice(0, 2).join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleCopyPlan(plan);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {copiedId === plan.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          {t('common.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          {t('common.copy')}
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDeletePlan(plan.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {plans.length === 0 ? t('savedPlans.noPlans') : t('savedPlans.noPlansFound')}
            </h3>
            <p className="text-gray-600">
              {plans.length === 0 
                ? t('savedPlans.createFirstPlan') 
                : t('savedPlans.tryFiltersOrSearch')
              }
            </p>
          </div>
        )}
      </div>

      {/* Plan Details Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.title}</h2>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Plan Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('savedPlans.planInfo')}</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">{t('savedPlans.description')}:</span>
                        <p className="text-gray-900">{selectedPlan.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">{t('savedPlans.createdAt')}:</span>
                        <p className="text-gray-900">{formatDate(selectedPlan.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">{t('savedPlans.tags')}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPlan.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Schedule Preview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('savedPlans.videoSchedule')}</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedPlan.contentPlan.videoSchedule.slice(0, 5).map((video, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{t('savedPlans.day')}: {video.day}</span>
                            <span className="text-xs text-gray-500">{video.platform}</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-1">{video.topic}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{video.hook}</p>
                        </div>
                      ))}
                      {selectedPlan.contentPlan.videoSchedule.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          {(t as (key: string, params?: any) => string)('savedPlans.moreVideos', { count: selectedPlan.contentPlan.videoSchedule.length - 5 })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleCopyPlan(selectedPlan)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {t('common.copyPlan')}
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(selectedPlan.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {selectedPlan.isFavorite ? (
                      <>
                        <StarFilled className="w-4 h-4" />
                        {t('savedPlans.removeFromFavorites')}
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        {t('savedPlans.addToFavorites')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedContentPlans; 