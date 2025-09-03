export interface PatientStory {
  id: string;
  name: string;
  age: number;
  story: string;
  shortDescription: string;
  image: string;
  targetAmount: number;
  raisedAmount: number;
  justGivingUrl: string;
  status: 'active' | 'completed';
  location: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  story: string;
  beforeImage: string;
  afterImage: string;
  videoUrl?: string;
  quote: string;
  completedDate: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  participants: number;
  fundsRaised?: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
}

export interface VolunteerForm {
  name: string;
  email: string;
  phone?: string;
  city: string;
  country: string;
  helpType: 'events' | 'fundraising' | 'social_media' | 'other';
  message?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Translation {
  en: {
    navigation: {
      home: string;
      about: string;
      stories: string;
      activities: string;
      join: string;
      partners: string;
      contact: string;
    };
    hero: {
      title: string;
      subtitle: string;
      donate: string;
      learnMore: string;
      stats: {
        raised: string;
        helped: string;
        countries: string;
      };
    };
    about: {
      title: string;
      mission: string;
      vision: string;
      team: string;
    };
    stories: {
      title: string;
      subtitle: string;
      donateBtn: string;
      learnMore: string;
    };
    activities: {
      title: string;
      subtitle: string;
    };
    join: {
      title: string;
      subtitle: string;
      form: {
        name: string;
        email: string;
        phone: string;
        city: string;
        country: string;
        helpType: string;
        message: string;
        submit: string;
      };
    };
    contact: {
      title: string;
      form: {
        name: string;
        email: string;
        subject: string;
        message: string;
        submit: string;
      };
    };
  };
  ua: {
    navigation: {
      home: string;
      about: string;
      stories: string;
      activities: string;
      join: string;
      partners: string;
      contact: string;
    };
    hero: {
      title: string;
      subtitle: string;
      donate: string;
      learnMore: string;
      stats: {
        raised: string;
        helped: string;
        countries: string;
      };
    };
    about: {
      title: string;
      mission: string;
      vision: string;
      team: string;
    };
    stories: {
      title: string;
      subtitle: string;
      donateBtn: string;
      learnMore: string;
    };
    activities: {
      title: string;
      subtitle: string;
    };
    join: {
      title: string;
      subtitle: string;
      form: {
        name: string;
        email: string;
        phone: string;
        city: string;
        country: string;
        helpType: string;
        message: string;
        submit: string;
      };
    };
    contact: {
      title: string;
      form: {
        name: string;
        email: string;
        subject: string;
        message: string;
        submit: string;
      };
    };
  };
}

export type Language = 'en' | 'ua';

// Export all types
export * from './youtube';

// Common types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

// Affiliate Program Types
export type AffiliateTier = 'Bronze' | 'Silver' | 'Gold';

export interface AffiliateStats {
  referrals: number;
  tier: AffiliateTier;
  commissionRate: number; // %
  recurringRate: number; // %
  bonus?: string;
  premiumSupport?: boolean;
}

export interface AffiliateReferral {
  id: string;
  email: string;
  joinedAt: string;
  paid: boolean;
  amount: number;
}

// AI Assistant Types
export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
  category: 'goals' | 'audience' | 'content' | 'platform' | 'style';
}

export interface UserAnswers {
  [questionId: string]: string | string[];
}

export interface VideoSchedule {
  day: number;
  topic: string;
  whatToShow: string;
  hook: string;
  platform: string;
  duration: string;
  hashtags: string[];
}

export interface ContentPlan {
  title: string;
  description: string;
  goals: string[];
  targetAudience: string;
  contentStrategy: string;
  platformStrategy: {
    [platform: string]: {
      contentTypes: string[];
      postingSchedule: string;
      optimizationTips: string[];
    };
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

export interface AIAssistantState {
  currentStep: number;
  totalSteps: number;
  answers: UserAnswers;
  isGenerating: boolean;
  contentPlan: ContentPlan | null;
  error: string | null;
}

export interface SavedContentPlan {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userAnswers: UserAnswers;
  contentPlan: ContentPlan;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
}

export interface ContentPlanFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  platforms?: string[];
  tags?: string[];
  isFavorite?: boolean;
  search?: string;
}