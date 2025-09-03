import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Search,
  ExternalLink,
  Eye,
  Heart,
  Play,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
// Для HTTP-запросов к backend
import axios from 'axios';
import { saveAs } from 'file-saver';

// Временно отключаем функционал поиска конкурентов для пользователей
const CompetitorAnalysis: React.FC = () => {
  // Можно вернуть заглушку или ничего не рендерить
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400 text-xl font-semibold">
      {/* Заглушка */}
      {/* <span>Функция анализа конкурентов временно недоступна.</span> */}
    </div>
  );
};

export default CompetitorAnalysis;