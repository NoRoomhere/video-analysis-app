# Video Analysis App

A modern web application for video analysis with YouTube integration and Stripe payments.

## Features

- 🎥 Video analysis and processing
- 🔗 YouTube API integration
- 💳 Stripe payment processing
- 🔐 Google OAuth authentication
- 📊 Analytics dashboard
- 🎨 Modern React UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth
- **Payments**: Stripe
- **Deployment**: Netlify
- **API**: YouTube API, Firebase

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console account
- Stripe account
- Netlify account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-analysis-app.git
cd video-analysis-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Start development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# YouTube API
VITE_YOUTUBE_CLIENT_ID=your_youtube_client_id
VITE_YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Firebase (optional)
VITE_FIREBASE_CONFIG=your_firebase_config
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
└── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details 