# 📊 Market Intelligence Agent

An AI-powered market analysis agent that:
- Scrapes and analyzes **websites**
- Extracts and answers questions from **YouTube transcripts**
- Fetches and analyzes **LinkedIn profiles or company pages**
- Structures the output with a **structured formatting tool**

Built with **Node.js**, **Express**, **LangChain**, and **React (Vite)**.

---

## 🚀 Features

✅ Analyze any website’s main content  
✅ Summarize and question YouTube videos  
✅ Parse LinkedIn company or profile data (using ScrapingDog API)  
✅ Generate well-structured markdown output with GPT-4o

---

## 🗂️ Project Structure

.
├── backend
│ ├── index.js
│ ├── .env
│ ├── package.json
│ └── ...
└── frontend
├── src
│ ├── App.jsx
│ ├── main.jsx
├── vite.config.js
├── package.json

---

## ⚙️ Requirements

- Node.js **18+** (or LTS)
- npm
- OpenAI API key
- Firecrawl API key (for website scraping)
- ScrapingDog API key (for LinkedIn scraping)

---

## 📄 Environment Variables

Create a `.env` file in the **backend root**:
```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
FIRECRAWL_API_KEY=YOUR_FIRECRAWL_API_KEY
SCRAPINGDOG_API_KEY=YOUR_SCRAPINGDOG_API_KEY
PORT=3000
---
## 📥 Install
1️⃣ Install backend dependencies

bash
npm install
2️⃣ Install frontend dependencies

bash
cd frontend
npm install


##🏃 Run Locally
1️⃣ Start the backend

bash
npm run dev
Backend runs on: http://localhost:3000

2️⃣ Start the frontend

bash
cd frontend
npm run dev
Frontend runs on: http://localhost:5173

##The Vite proxy in vite.config.js will forward /api calls to your backend.