import { Link } from 'react-router-dom';
import logo from '../../assets/aurelo-logo.png';
import { useLanguage } from '../../context/LanguageContext';

const LandingHeader = () => {
  const { t } = useLanguage();
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo and Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Aurelo Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">
                {t('landingHeader.brand')}
              </span>
            </Link>
          </div>

          {/* Right side: Button */}
          <div className="flex items-center space-x-2">
            <Link
              to="/video-analysis"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
            >
              {t('landingHeader.signUp')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader; 