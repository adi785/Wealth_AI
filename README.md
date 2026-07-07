<div align="center">
<h1>💰 Wealth AI</h1>
<p><strong>AI-Powered Financial Intelligence for IDBI</strong></p>
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

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY not found` | Check `.env.local` exists and API key is correctly set |
| `npm install fails` | Try `npm cache clean --force` and reinstall |
| `Port 3000 already in use` | Run `npm run dev -- -p 3001` to use a different port |


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
<p>Built by InnoVyom with ❤️ for the hackathon</p>
</div>
