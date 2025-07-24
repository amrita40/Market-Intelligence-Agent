# Troubleshooting Guide

## Main Issue Analysis

The primary reason your Market Intelligence Agent was not working was **missing API keys**. The application requires three external API services to function properly.

## Error Analysis

### 1. **Primary Error: Missing OpenAI API Key**
```
Error: OpenAI or Azure OpenAI API key or Token Provider not found
```

**Cause**: The application was trying to initialize the ChatOpenAI model without a valid API key.

**Solution**: Add your OpenAI API key to the `.env` file.

### 2. **Secondary Issues: Missing Other API Keys**
The application also requires:
- **Firecrawl API Key**: For website scraping functionality
- **ScrapingDog API Key**: For LinkedIn profile/company scraping

## Quick Fix Steps

### Step 1: Set Up Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual API keys:
   ```bash
   # Get from https://platform.openai.com/api-keys
   OPENAI_API_KEY=sk-your_actual_openai_key_here
   
   # Get from https://www.firecrawl.dev/
   FIRECRAWL_API_KEY=fc-your_actual_firecrawl_key_here
   
   # Get from https://scrapingdog.com/
   SCRAPINGDOG_API_KEY=your_actual_scrapingdog_key_here
   ```

### Step 2: Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### Step 3: Start the Application
```bash
# Terminal 1: Start backend
npm start

# Terminal 2: Start frontend
cd frontend && npm run dev
```

### Step 4: Access the Application
Open your browser and go to: `http://localhost:5173`

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Symptoms**: Frontend shows connection errors
**Cause**: Backend not running or wrong port
**Solution**: 
1. Ensure backend is running on port 3000
2. Check if `http://localhost:3000` responds
3. Verify Vite proxy configuration in `frontend/vite.config.js`

### Issue: "API request failed"
**Symptoms**: Specific API calls fail
**Cause**: Invalid or missing API keys for specific services
**Solution**: 
1. Verify the specific API key in `.env`
2. Test the API key directly with the service
3. Check API key permissions and quotas

### Issue: "Module not found" errors
**Symptoms**: Import/require errors
**Cause**: Missing dependencies
**Solution**: 
```bash
npm install  # for backend
cd frontend && npm install  # for frontend
```

### Issue: CORS errors
**Symptoms**: Browser console shows CORS errors
**Cause**: Frontend and backend on different origins
**Solution**: The app is already configured for CORS with `cors` middleware

## API Key Setup Guide

### 1. OpenAI API Key (Required)
- Visit: https://platform.openai.com/api-keys
- Create account and add payment method
- Generate new API key
- Copy key to `.env` file

### 2. Firecrawl API Key (Required for website analysis)
- Visit: https://www.firecrawl.dev/
- Sign up for account
- Get API key from dashboard
- Copy key to `.env` file

### 3. ScrapingDog API Key (Required for LinkedIn analysis)
- Visit: https://scrapingdog.com/
- Sign up for account
- Get API key from dashboard
- Copy key to `.env` file

## Testing Your Setup

### Test Backend
```bash
# Should return: "✅ Market Intelligence Backend is running!"
curl http://localhost:3000
```

### Test Frontend
1. Open `http://localhost:5173`
2. Try the "Analyze Website" tool with a simple website
3. Check browser console for any errors

## Architecture Overview

```
Frontend (React + Vite) ──── HTTP ───→ Backend (Express + Node.js)
     ↓                                        ↓
Port 5173                              Port 3000
     ↓                                        ↓
Proxy /api/* ────────────────────────→ API Endpoints
                                             ↓
                                    External APIs:
                                    - OpenAI GPT-4
                                    - Firecrawl
                                    - ScrapingDog
```

## Still Having Issues?

1. **Check the logs**: Look at both terminal outputs for error messages
2. **Verify API keys**: Test each API key independently
3. **Check network**: Ensure you can access external APIs
4. **Update dependencies**: Run `npm update` in both directories
5. **Clear cache**: Delete `node_modules` and reinstall

## Quick Setup Script

Run the automated setup:
```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Install all dependencies
- Create `.env` file from template
- Provide setup instructions