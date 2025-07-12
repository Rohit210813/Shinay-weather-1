# SHINAY Weather App 🌤️

**Forecasting the Future, One Second at a Time.**

A modern, full-stack weather forecast website built with Next.js, featuring real-time weather data, beautiful animations, and a dark-themed glassmorphism UI.

![SHINAY Weather App](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🌐 Frontend
- **Dark Theme**: Beautiful black and purple gradient design with glassmorphism effects
- **Real-time Clock**: Updates every second with elegant typography
- **Weather Display**: Current conditions with temperature, humidity, wind, pressure, visibility, UV index
- **Animated Weather Icons**: Dynamic icons that pulse and animate based on conditions
- **Weather Background**: Animated particles for rain/snow, floating orbs for clear weather
- **Responsive Design**: Works perfectly on mobile and desktop
- **Futuristic Fonts**: Uses Orbitron and Rajdhani fonts

### ⚙️ Backend
- **Dual API Support**: WeatherAPI.com (premium) with Open-Meteo fallback (free)
- **Auto Location**: IP-based location detection
- **Real-time Updates**: Refreshes data every 60 seconds
- **Error Handling**: Robust error handling with user-friendly messages
- **Caching Ready**: Optimized for performance

### 📱 PWA Features
- **Progressive Web App**: Install on mobile devices
- **SEO Optimized**: Meta tags for search engines and social sharing
- **Offline Ready**: Cached resources for better performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/shinay-weather-app.git
   cd shinay-weather-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables (Optional)**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your WeatherAPI key to `.env.local`:
   \`\`\`
   WEATHER_API_KEY=your_weatherapi_key_here
   \`\`\`
   
   > **Note**: The app works without an API key using the free Open-Meteo service as fallback.

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 API Configuration

### WeatherAPI.com (Recommended)
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your free API key
3. Add it to your `.env.local` file
4. Enjoy enhanced weather data with icons and more details

### Open-Meteo (Fallback)
- No API key required
- Automatically used when WeatherAPI key is not available
- Provides essential weather data for all core features

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `WEATHER_API_KEY` environment variable in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/shinay-weather-app)

### Deploy to Netlify
1. Connect your repository to [Netlify](https://netlify.com)
2. Add environment variables in Netlify dashboard
3. Deploy!

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Orbitron, Rajdhani
- **Weather APIs**: WeatherAPI.com, Open-Meteo
- **Deployment**: Vercel, Netlify

## 📁 Project Structure

\`\`\`
shinay-weather-app/
├── app/
│   ├── api/weather/route.ts    # Weather API endpoint
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── clock.tsx               # Real-time clock
│   ├── weather-display.tsx     # Current weather
│   ├── forecast-cards.tsx      # Hourly/daily forecasts
│   ├── search-bar.tsx          # Location search
│   ├── weather-icon.tsx        # Animated weather icons
│   ├── weather-background.tsx  # Animated backgrounds
│   ├── loading-spinner.tsx     # Loading states
│   └── error-message.tsx       # Error handling
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # App icons
└── ...config files
\`\`\`

## 🎨 Customization

### Colors
The app uses a purple and black theme. Customize colors in `tailwind.config.ts`:

\`\`\`typescript
colors: {
  purple: {
    // Your custom purple shades
  }
}
\`\`\`

### Fonts
Change fonts in `app/layout.tsx` and update the Google Fonts imports.

### Weather Icons
Customize weather icons in `components/weather-icon.tsx` using Lucide React icons.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WeatherAPI.com](https://www.weatherapi.com/) for weather data
- [Open-Meteo](https://open-meteo.com/) for free weather API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for icons
- [Vercel](https://vercel.com/) for hosting

## 📧 Contact

Created by **SHINAY Team** - feel free to contact us!

---

**SHINAY** - *Forecasting the Future, One Second at a Time.* 🌤️
