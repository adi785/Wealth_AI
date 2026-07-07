<div align="center">
<h1>💰 Wealth AI</h1>
<p><strong>AI-Powered Financial Intelligence for IDBI</strong></p>
<img width="1200" height="475" alt="Wealth AI Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

---

## 🚀 What is Wealth AI?

Wealth AI is an intelligent financial assistant built with Google's Gemini AI, designed to provide smart wealth management and financial insights. Whether you're looking to optimize your investments, understand market trends, or get personalized financial advice, Wealth AI has you covered.

**Built for:** IDBI Bank | **Tech Stack:** TypeScript, Node.js, Google Gemini API

---

## ✨ Features

- 🤖 **AI-Powered Insights** - Get real-time financial recommendations powered by Gemini
- 💡 **Smart Analysis** - Analyze investment portfolios and wealth strategies
- 🎯 **Personalized Advice** - Tailored financial guidance based on your goals
- ⚡ **Fast & Responsive** - Built with modern web technologies for optimal performance
- 🔒 **Secure** - API-key based authentication with environment variables

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **TypeScript** | Type-safe development (99.4% of codebase) |
| **Node.js** | Backend runtime |
| **Google Gemini API** | AI/ML engine for financial intelligence |
| **Next.js/React** | Frontend framework |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (get it from [ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/adi785/Wealth_AI.git
   cd Wealth_AI
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from [Google AI Studio](https://ai.studio)

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

4. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

---

## 📋 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run code linting
npm run test     # Run tests (if configured)
```

---

## 🎨 Project Structure

```
Wealth_AI/
├── app/                 # Main application code
├── components/          # Reusable React components
├── pages/              # Page routes
├── public/             # Static assets
├── .env.local          # Environment variables (DO NOT COMMIT)
├── package.json        # Dependencies & scripts
└── README.md           # This file
```

---

## 🔑 API Configuration

### Setting Up Gemini API

1. Go to [Google AI Studio](https://ai.studio)
2. Create or select a project
3. Generate an API key
4. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your_generated_key
   ```

**Note:** Never commit `.env.local` to version control!

---

## 🎯 Hackathon Tips

### ⏱️ Time-Saving Ideas
- Use pre-built Gemini API prompts for common financial queries
- Leverage TypeScript for type safety to catch bugs early
- Use the development server's hot reload for rapid iteration

### 🧪 Testing Locally
- Start with simple API calls to ensure your key is working
- Test financial calculation accuracy with sample data
- Verify response times under load

### 📦 Deployment Options
- **Vercel** - Zero-config deployment for Next.js
- **Netlify** - Easy git-based deployment
- **Google Cloud Run** - Container-based deployment

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY not found` | Check `.env.local` exists and API key is correctly set |
| `npm install fails` | Try `npm cache clean --force` and reinstall |
| `Port 3000 already in use` | Run `npm run dev -- -p 3001` to use a different port |

---

## 📚 Documentation

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [View your app in AI Studio](https://ai.studio/apps/da8584d5-d80f-428c-b475-dd4f7fa9eacb)
- Official AI Studio Documentation

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is part of the IDBI AI initiative.

---

## 🎖️ Hackathon Resources

- **Gemini API Rate Limits**: 60 requests/minute (free tier)
- **Response Time Target**: < 2 seconds for optimal UX
- **Best Practices**: Always handle API errors gracefully

---

<div align="center">
<p><strong>Happy Hacking! 🚀</strong></p>
<p>Built with ❤️ for the hackathon</p>
</div>
