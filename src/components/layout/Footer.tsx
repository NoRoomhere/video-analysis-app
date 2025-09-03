import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github
} from 'lucide-react';
import logo from '../../assets/aurelo-logo.png';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@aurelo.dev',
      href: 'mailto:contact@aurelo.dev'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '123 Business Ave, Suite 100, New York, NY 10001'
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Mon-Fri: 9:00 AM - 6:00 PM EST'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Video Analysis', path: '/video-analysis' },
    { name: 'Social Media', path: '/social-automation' },
    { name: 'Competitor Analysis', path: '/competitor-analysis' },
    { name: 'Trends', path: '/trends' },
    { name: 'AI Assistant', path: '/ai-chat' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/policies' },
    { name: 'Terms of Service', path: '/policies' },
    { name: 'Cookie Policy', path: '/policies' }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Aurelo Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">
                {t('footer.brand')}
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering businesses with AI-driven marketing insights and automation tools to boost their digital presence and drive growth.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <div key={contact.label} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">{contact.label}</p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">{contact.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Aurelo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                API
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 