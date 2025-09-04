import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  Hash, 
  Music, 
  Video,
  TrendingUp,
  Filter,
  Clock,
  Bookmark,
  ExternalLink
} from 'lucide-react';

const TrendsNews = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const categories = [
    { id: 'all', name: 'All', icon: Globe },
    { id: 'hashtags', name: 'Hashtags', icon: Hash },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'content', name: 'Content', icon: Video },
  ];

  const timeframes = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
  ];

  const trendingHashtags = [
    { tag: '#AIMarketing', posts: '2.4M', growth: '+156%', platform: 'TikTok' },
    { tag: '#DigitalNomad', posts: '1.8M', growth: '+89%', platform: 'Instagram' },
          { tag: '#ContentCreator', posts: '3.2M', growth: '+67%', platform: 'Instagram' },
    { tag: '#Entrepreneur', posts: '5.1M', growth: '+45%', platform: 'TikTok' },
    { tag: '#WorkFromHome', posts: '1.2M', growth: '+123%', platform: 'Instagram' },
  ];

  const trendingMusic = [
    {
      title: 'Aesthetic Vibes',
      artist: 'TrendyBeats',
      uses: '890K',
      growth: '+234%',
      duration: '0:30',
      genre: 'Lo-fi'
    },
    {
      title: 'Motivation Monday',
      artist: 'SuccessSound',
      uses: '654K',
      growth: '+189%',
      duration: '0:15',
      genre: 'Upbeat'
    },
    {
      title: 'Chill Vibes Only',
      artist: 'RelaxBeats',
      uses: '432K',
      growth: '+156%',
      duration: '0:45',
      genre: 'Ambient'
    },
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'TikTok Algorithm Update: What Creators Need to Know',
      summary: 'Latest changes to TikTok\'s algorithm favor longer-form content and authentic engagement.',
      source: 'Social Media Today',
      time: '2 hours ago',
      category: 'Platform Updates',
      readTime: '3 min read',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Instagram Reels vs TikTok: Performance Comparison 2024',
      summary: 'New data reveals which platform is driving better engagement for different content types.',
      source: 'Marketing Land',
      time: '4 hours ago',
      category: 'Analytics',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'AI-Generated Content: The Future of Social Media',
      summary: 'How artificial intelligence is revolutionizing content creation and what it means for creators.',
      source: 'Tech Crunch',
      time: '6 hours ago',
      category: 'Technology',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
  ];

  const contentIdeas = [
    {
      title: 'Day in the Life of an Entrepreneur',
      niche: 'Business',
      potential: 'High',
      difficulty: 'Easy',
      trending: true,
      description: 'Show your daily routine and productivity tips'
    },
    {
      title: 'Before & After Transformations',
      niche: 'Lifestyle',
      potential: 'Very High',
      difficulty: 'Medium',
      trending: true,
      description: 'Any type of transformation content performs well'
    },
    {
      title: 'Quick Tutorial Series',
      niche: 'Education',
      potential: 'High',
      difficulty: 'Easy',
      trending: false,
      description: 'Bite-sized educational content in your expertise area'
    },
    {
      title: 'Behind the Scenes Content',
      niche: 'General',
      potential: 'Medium',
      difficulty: 'Easy',
      trending: true,
      description: 'Show the process behind your work or products'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-4 py-2 text-sm font-medium text-orange-700 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Trends & News</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stay Ahead of{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Trends
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what's trending now, get personalized content ideas, and stay updated 
            with the latest industry news in your niche.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Category:</span>
              </div>
              <div className="flex space-x-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Timeframe:</span>
              </div>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {timeframes.map((timeframe) => (
                  <option key={timeframe.id} value={timeframe.id}>
                    {timeframe.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trending Hashtags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Hash className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Trending Hashtags</h3>
              </div>
              
              <div className="space-y-4">
                {trendingHashtags.map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{hashtag.tag}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{hashtag.posts} posts</span>
                          <span className="text-green-600 font-medium">{hashtag.growth}</span>
                          <span className="bg-gray-200 px-2 py-1 rounded text-xs">{hashtag.platform}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending Music */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Music className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Trending Music</h3>
              </div>
              
              <div className="space-y-4">
                {trendingMusic.map((music, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{music.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{music.artist}</span>
                          <span>{music.uses} uses</span>
                          <span className="text-green-600 font-medium">{music.growth}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{music.duration}</div>
                      <div className="text-xs text-gray-500">{music.genre}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Industry News */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Industry News</h3>
              </div>
              
              <div className="space-y-6">
                {newsArticles.map((article) => (
                  <div key={article.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-xs">{article.time}</span>
                        <span className="text-gray-500 text-xs">{article.readTime}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{article.source}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            {/* Content Ideas */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Ideas for You</h3>
              <div className="space-y-4">
                {contentIdeas.map((idea, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{idea.title}</h4>
                      {idea.trending && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mb-3">{idea.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{idea.niche}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          idea.potential === 'Very High' ? 'text-green-600' :
                          idea.potential === 'High' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {idea.potential}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{idea.difficulty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Trends</span>
                  <span className="font-semibold text-gray-900">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Viral Videos</span>
                  <span className="font-semibold text-gray-900">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hot Hashtags</span>
                  <span className="font-semibold text-gray-900">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">News Articles</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
              </div>
            </div>

            {/* Personalized Alerts */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">🔔 Trend Alert</h3>
              <p className="text-orange-100 text-sm mb-4">
                #AIMarketing is exploding! Perfect time to create content about AI tools and automation.
              </p>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                Create Content
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendsNews;