# Portfolio Contact Form Backend

Simple Node.js + Express + SQLite backend for handling portfolio contact form submissions.

## Features

- Express.js REST API
- SQLite database for persistent storage
- Input validation
- CORS enabled
- SQL injection protection (prepared statements)
- Lightweight and easy to deploy

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST `/api/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact information saved successfully",
  "id": 1
}
```

**Response (Error):**
```json
{
  "error": "Validation failed",
  "details": ["Name is required", "Email is invalid"]
}
```

### GET `/api/contacts` (Admin)

Retrieve all contact submissions.

**Response:**
```json
{
  "contacts": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello...",
      "created_at": "2026-01-05 10:30:00"
    }
  ]
}
```

### GET `/health`

Check server health.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Database Schema

```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Deploy:
```bash
railway up
```

4. Set environment variables in Railway dashboard

### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Deploy

### Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login and launch:
```bash
fly auth login
fly launch
```

3. Deploy:
```bash
fly deploy
```

## Frontend Configuration

Update the API URL in your frontend `code.html`:

```javascript
// For local development
const API_URL = 'http://localhost:3000/api/contact';

// For production (replace with your deployed URL)
const API_URL = 'https://your-backend.railway.app/api/contact';
```

## Security Considerations

- Input validation on all fields
- Prepared statements prevent SQL injection
- CORS configured to accept requests from your frontend
- Rate limiting recommended for production (add middleware)
- Consider adding captcha for spam prevention

## License

MIT

