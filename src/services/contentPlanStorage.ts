import { SavedContentPlan, ContentPlanFilters, UserAnswers, ContentPlan } from '../types';

export class ContentPlanStorageService {
  private readonly STORAGE_KEY = 'saved_content_plans';
  private readonly MAX_PLANS = 50; // Максимальное количество сохраненных планов

  // Получить все сохраненные планы
  getAllPlans(): SavedContentPlan[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const plans: SavedContentPlan[] = JSON.parse(stored);
      return plans.map(plan => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt)
      }));
    } catch (error) {
      console.error('Ошибка при загрузке сохраненных планов:', error);
      return [];
    }
  }

  // Сохранить новый план
  savePlan(
    title: string,
    description: string,
    userAnswers: UserAnswers,
    contentPlan: ContentPlan,
    tags: string[] = [],
    notes?: string
  ): SavedContentPlan {
    const plans = this.getAllPlans();
    
    const newPlan: SavedContentPlan = {
      id: this.generateId(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAnswers,
      contentPlan,
      isFavorite: false,
      tags,
      notes
    };

    // Добавляем новый план в начало списка
    plans.unshift(newPlan);

    // Ограничиваем количество сохраненных планов
    if (plans.length > this.MAX_PLANS) {
      plans.splice(this.MAX_PLANS);
    }

    this.saveToStorage(plans);
    return newPlan;
  }

  // Обновить существующий план
  updatePlan(id: string, updates: Partial<SavedContentPlan>): SavedContentPlan | null {
    const plans = this.getAllPlans();
    const planIndex = plans.findIndex(plan => plan.id === id);
    
    if (planIndex === -1) return null;

    plans[planIndex] = {
      ...plans[planIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage(plans);
    return plans[planIndex];
  }

  // Удалить план
  deletePlan(id: string): boolean {
    const plans = this.getAllPlans();
    const filteredPlans = plans.filter(plan => plan.id !== id);
    
    if (filteredPlans.length === plans.length) {
      return false; // План не найден
    }

    this.saveToStorage(filteredPlans);
    return true;
  }

  // Получить план по ID
  getPlanById(id: string): SavedContentPlan | null {
    const plans = this.getAllPlans();
    return plans.find(plan => plan.id === id) || null;
  }

  // Поиск планов по фильтрам
  searchPlans(filters: ContentPlanFilters): SavedContentPlan[] {
    let plans = this.getAllPlans();

    // Фильтр по дате
    if (filters.dateRange) {
      plans = plans.filter(plan => 
        plan.createdAt >= filters.dateRange!.start && 
        plan.createdAt <= filters.dateRange!.end
      );
    }

    // Фильтр по платформам
    if (filters.platforms && filters.platforms.length > 0) {
      plans = plans.filter(plan => 
        filters.platforms!.some(platform => 
          plan.contentPlan.platformStrategy[platform]
        )
      );
    }

    // Фильтр по тегам
    if (filters.tags && filters.tags.length > 0) {
      plans = plans.filter(plan => 
        filters.tags!.some(tag => plan.tags.includes(tag))
      );
    }

    // Фильтр по избранным
    if (filters.isFavorite !== undefined) {
      plans = plans.filter(plan => plan.isFavorite === filters.isFavorite);
    }

    // Поиск по тексту
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      plans = plans.filter(plan => 
        plan.title.toLowerCase().includes(searchLower) ||
        plan.description.toLowerCase().includes(searchLower) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return plans;
  }

  // Переключить избранное
  toggleFavorite(id: string): boolean {
    const plan = this.getPlanById(id);
    if (!plan) return false;

    this.updatePlan(id, { isFavorite: !plan.isFavorite });
    return true;
  }

  // Получить статистику
  getStats() {
    const plans = this.getAllPlans();
    const total = plans.length;
    const favorites = plans.filter(plan => plan.isFavorite).length;
    const thisMonth = plans.filter(plan => {
      const now = new Date();
      const planDate = new Date(plan.createdAt);
      return planDate.getMonth() === now.getMonth() && 
             planDate.getFullYear() === now.getFullYear();
    }).length;

    // Статистика по платформам
    const platformStats: Record<string, number> = {};
    plans.forEach(plan => {
      Object.keys(plan.contentPlan.platformStrategy).forEach(platform => {
        platformStats[platform] = (platformStats[platform] || 0) + 1;
      });
    });

    return {
      total,
      favorites,
      thisMonth,
      platformStats
    };
  }

  // Экспорт всех планов
  exportPlans(): string {
    const plans = this.getAllPlans();
    return JSON.stringify(plans, null, 2);
  }

  // Импорт планов
  importPlans(jsonData: string): boolean {
    try {
      const plans: SavedContentPlan[] = JSON.parse(jsonData);
      
      // Валидация данных
      const validPlans = plans.filter(plan => 
        plan.id && 
        plan.title && 
        plan.contentPlan && 
        plan.createdAt && 
        plan.updatedAt
      );

      if (validPlans.length === 0) {
        throw new Error('Нет валидных планов для импорта');
      }

      // Объединяем с существующими планами
      const existingPlans = this.getAllPlans();
      const existingIds = new Set(existingPlans.map(p => p.id));
      
      const newPlans = validPlans.filter(plan => !existingIds.has(plan.id));
      const allPlans = [...newPlans, ...existingPlans];

      this.saveToStorage(allPlans);
      return true;
    } catch (error) {
      console.error('Ошибка при импорте планов:', error);
      return false;
    }
  }

  // Очистить все планы
  clearAllPlans(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Приватные методы
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(plans: SavedContentPlan[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Ошибка при сохранении планов:', error);
    }
  }
}

export const contentPlanStorage = new ContentPlanStorageService(); 