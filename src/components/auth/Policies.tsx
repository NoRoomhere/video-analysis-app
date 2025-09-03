import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Cookie, ChevronRight } from 'lucide-react';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ];

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      effectiveDate: 'January 1, 2024',
      lastUpdated: 'January 1, 2024',
      content: [
        {
          title: 'Information We Collect',
          text: `We collect the following types of data:

a. Public TikTok Data
We analyze publicly available data from TikTok, such as:
• Username
• Profile picture
• Bio
• Number of followers, likes, posts, engagement, etc.
• Recent video statistics

We do not collect private or non-public TikTok data.

b. User Account Data (via Firebase)
If you register or log in to our platform, we may collect:
• Email address
• Name or nickname (optional)
• Login metadata (e.g. time of login, IP, device type)

This data is securely handled by Google Firebase Authentication.

c. Behavioral & Technical Data
We use tools like Google Analytics or Firebase Analytics to collect:
• Browser type
• Device info
• Location (approximate, based on IP)
• Time on site, pages visited, click behavior

d. AI-Generated Insights (OpenAI API)
We may process TikTok data through OpenAI's API to provide:
• AI-generated analysis
• Personalized recommendations
• Natural language feedback

Data sent to OpenAI is processed anonymously and not stored permanently.`
        },
        {
          title: 'How We Use Your Data',
          text: `We use collected data to:
• Provide TikTok account insights
• Generate AI-powered feedback
• Improve our analytics and UX
• Detect and prevent misuse of the platform
• Notify you about updates or changes (if opted in)`
        },
        {
          title: 'Data Storage & Security',
          text: `We use Firebase Firestore and Firebase Hosting, which are managed by Google Cloud. Your data is encrypted in transit and at rest.

We implement strict access controls, monitoring, and API security to prevent unauthorized access.`
        },
        {
          title: 'Cookies & Tracking',
          text: `We may use cookies or local storage to:
• Maintain user sessions
• Track behavior anonymously for analytics
• Improve functionality (e.g. dark mode settings)

You can disable cookies through your browser, though this may limit functionality.`
        },
        {
          title: 'Third-Party Services',
          text: `We use third-party services:

Service | Purpose | Privacy Policy
Firebase | Authentication & database | firebase.google.com/support/privacy
OpenAI API | Text generation & analysis | openai.com/privacy
Google Analytics | Behavior tracking | policies.google.com/privacy
TikTok (public) | Source of analyzed content | tiktok.com/legal/privacy-policy

We do not share your personal data with third parties for advertising or resale.`
        },
        {
          title: 'Your Rights',
          text: `Depending on your jurisdiction (e.g. UK, EU, California), you may have the right to:
• Access your data
• Delete or correct your data
• Withdraw consent
• Request a copy of stored data

You can send such requests to contact@marketingtool.com. We respond within 30 days.`
        },
        {
          title: "Children's Privacy",
          text: `Our services are not intended for users under 13. We do not knowingly collect data from children. If you believe we have done so, please contact us for deletion.`
        },
        {
          title: 'Updates to This Policy',
          text: `We may update this Privacy Policy from time to time. Significant changes will be posted on this page and notified to registered users via email.`
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      effectiveDate: 'January 1, 2024',
      lastUpdated: 'January 1, 2024',
      content: [
        {
          title: 'Description of Service',
          text: `We provide tools to analyze public TikTok profiles, generate AI-based insights, and display user engagement data. All data processed is either public or voluntarily submitted by the user.`
        },
        {
          title: 'User Eligibility',
          text: `You must be at least 13 years old to use our services. If you are under 18, you must have the permission of a parent or legal guardian.`
        },
        {
          title: 'User Accounts',
          text: `You may need to register using your email address via Firebase Authentication.

You are responsible for:
• Keeping your login credentials secure
• All activity under your account
• Not sharing or misusing access credentials

We reserve the right to suspend or terminate accounts in case of abuse or violations.`
        },
        {
          title: 'Acceptable Use',
          text: `You agree not to:
• Use the platform for unlawful or harmful purposes
• Attempt to reverse-engineer, copy, or resell our tools
• Submit personal data or copyrighted TikTok content
• Use bots, scripts, or automation to overload our servers
• Analyze TikTok accounts you do not have legal access to

Violations may result in account termination or legal action.`
        },
        {
          title: 'TikTok Content Disclaimer',
          text: `We do not store, control, or guarantee the accuracy of TikTok content. All data is retrieved from publicly available sources and used strictly for analytical purposes.

We are not affiliated with TikTok Inc., and TikTok's terms of use apply independently to its platform.`
        },
        {
          title: 'AI-Generated Content',
          text: `Some insights are generated using OpenAI's API. These are for informational purposes only and should not be considered advice or factual statements.

We are not liable for actions taken based on AI-generated analysis.`
        },
        {
          title: 'Intellectual Property',
          text: `All content on this site, including branding, UI/UX, and original features, is owned by MarketingTool. You may not reuse or redistribute this content without permission.`
        },
        {
          title: 'Limitation of Liability',
          text: `We are not liable for any damages, losses, or actions resulting from:
• Misuse of our platform
• Incorrect TikTok data
• AI misinterpretation
• Service interruptions or downtime

Use the platform at your own risk.`
        },
        {
          title: 'Service Availability',
          text: `We reserve the right to modify, limit, suspend, or terminate any part of the service at any time without notice.`
        },
        {
          title: 'Privacy',
          text: `Our Privacy Policy explains how we collect and use data. By using the service, you also agree to our privacy practices.`
        },
        {
          title: 'Changes to These Terms',
          text: `We may update these Terms at any time. Continued use of the service after changes implies acceptance of the new version.`
        },
        {
          title: 'Governing Law',
          text: `These Terms are governed by the laws of the United States. Any disputes will be handled in local courts of jurisdiction.`
        }
      ]
    },
    cookies: {
      title: 'Cookie Policy',
      effectiveDate: 'January 1, 2024',
      lastUpdated: 'January 1, 2024',
      content: [
        {
          title: 'What Are Cookies',
          text: 'Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.'
        },
        {
          title: 'Types of Cookies We Use',
          text: `We use several types of cookies:

• Essential Cookies: Necessary for the website to function properly
• Analytics Cookies: Help us understand how visitors interact with our site
• Preference Cookies: Remember your settings and choices
• Session Cookies: Maintain your login session while using our platform`
        },
        {
          title: 'Managing Cookies',
          text: `You can control and manage cookies through your browser settings. You can:
• Delete existing cookies
• Prevent new ones from being set
• Block cookies from specific websites

However, disabling cookies may affect the functionality of our website.`
        },
        {
          title: 'Third-Party Cookies',
          text: `Some cookies on our website are set by third-party services:
• Google Analytics for website analytics
• Firebase for authentication and functionality
• OpenAI for AI-powered features

These cookies are subject to the privacy policies of those third parties.`
        },
        {
          title: 'Cookie Consent',
          text: `By using our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by:
• Changing your browser settings
• Contacting us directly
• Using our cookie management tools`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Policies
          </h1>
          <p className="text-lg text-gray-600">
            Please review our policies to understand how we protect your rights and data
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {policies[activeTab as keyof typeof policies].title}
                </h2>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Effective Date: {policies[activeTab as keyof typeof policies].effectiveDate}</p>
                  <p>Last Updated: {policies[activeTab as keyof typeof policies].lastUpdated}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {policies[activeTab as keyof typeof policies].content.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <ChevronRight className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {section.title}
                        </h3>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {section.text}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about these policies or your data, contact us at:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>📧 contact@marketingtool.com</p>
            <p>🌐 marketingtool.com</p>
            <p>🏢 MarketingTool</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies; 