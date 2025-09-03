import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, Heart } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { number: '10K+', label: 'Active Users', icon: Users },
    { number: '500M+', label: 'Videos Analyzed', icon: Eye },
    { number: '95%', label: 'Prediction Accuracy', icon: Heart },
    { number: '24/7', label: 'AI Support', icon: TrendingUp },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-lg text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;