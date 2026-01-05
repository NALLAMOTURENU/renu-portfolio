# Portfolio Deployment Guide

## Overview

Your portfolio consists of two parts:
1. **Frontend** - Static HTML file (`code.html`) - can be hosted anywhere
2. **Backend** - Node.js server (`/server`) - needs to be deployed separately

## Frontend Deployment

The frontend is a single HTML file and can be deployed to:

### Option 1: GitHub Pages
1. Push `code.html` to GitHub
2. Rename to `index.html`
3. Enable GitHub Pages in repository settings

### Option 2: Netlify
1. Drag and drop the `portfolio` folder to Netlify
2. Rename `code.html` to `index.html` or set it as the index file

### Option 3: Vercel
```bash
vercel deploy
```

## Backend Deployment

### Railway (Recommended)

**Steps:**
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Navigate to server directory:
```bash
cd server
```

3. Login and deploy:
```bash
railway login
railway init
railway up
```

4. Get your deployment URL from Railway dashboard

5. Update frontend `code.html` line ~1039:
```javascript
const API_URL = 'https://your-app.railway.app/api/contact';
```

**Environment Variables:**
- Railway will auto-detect Node.js and set PORT
- No additional config needed for SQLite

### Render

**Steps:**
1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Deploy

6. Copy the service URL and update frontend:
```javascript
const API_URL = 'https://your-service.onrender.com/api/contact';
```

### Fly.io

**Steps:**
1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Navigate to server directory:
```bash
cd server
```

3. Login and launch:
```bash
fly auth login
fly launch
```

4. Deploy:
```bash
fly deploy
```

5. Update frontend with Fly.io URL

## Local Development

### Frontend
Simply open `code.html` in a browser or use a local server:
```bash
# Python
python -m http.server 8000

# Node
npx http-server

# VS Code
# Use Live Server extension
```

### Backend
```bash
cd server
npm install
npm run dev  # or npm start
```

Server runs on `http://localhost:3000`

## Configuration

### Update API URL in Frontend

Edit `code.html` line ~1039:

**Local Development:**
```javascript
const API_URL = 'http://localhost:3000/api/contact';
```

**Production:**
```javascript
const API_URL = 'https://your-backend-url.com/api/contact';
```

### CORS Configuration (Optional)

If you want to restrict CORS to your domain only, edit `server/server.js`:

```javascript
app.use(cors({
  origin: 'https://yourportfolio.com'
}));
```

## Testing

### Test Backend Health
```bash
curl http://localhost:3000/health
```

### Test Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### View Contacts (Admin)
```bash
curl http://localhost:3000/api/contacts
```

## Security Recommendations

1. **Rate Limiting:** Add rate limiting middleware in production
```bash
npm install express-rate-limit
```

2. **Environment Variables:** Never commit `.env` file

3. **CAPTCHA:** Consider adding reCAPTCHA for spam prevention

4. **Admin Authentication:** Add auth middleware to `/api/contacts` endpoint

5. **HTTPS:** Ensure both frontend and backend use HTTPS in production

## Troubleshooting

**Frontend can't reach backend:**
- Check CORS settings
- Verify API_URL is correct
- Check browser console for errors

**Database errors:**
- Ensure SQLite is installed
- Check file permissions for `contacts.db`
- Verify database directory is writable

**Port conflicts:**
- Change PORT in `.env` file
- Default is 3000

## File Structure
```
portfolio/
├── code.html              # Frontend
├── images/               # Assets
├── server/
│   ├── server.js         # Backend API
│   ├── package.json      # Dependencies
│   ├── .env.example      # Config template
│   ├── .gitignore
│   ├── README.md
│   └── contacts.db       # SQLite database (auto-created)
```

