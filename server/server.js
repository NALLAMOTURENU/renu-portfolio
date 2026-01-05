const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'contacts.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database table
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Contacts table ready');
    }
  });
}

// Validation helper
function validateContactData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Email is invalid');
    }
  }
  
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required');
  }
  
  return errors;
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate input
  const validationErrors = validateContactData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validationErrors 
    });
  }
  
  // Insert into database using prepared statement
  const insertSQL = `
    INSERT INTO contacts (name, email, message)
    VALUES (?, ?, ?)
  `;
  
  db.run(insertSQL, [name.trim(), email.trim(), message.trim()], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        error: 'Failed to save contact information' 
      });
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Contact information saved successfully',
      id: this.lastID
    });
  });
});

// Get all contacts (optional - for admin use)
app.get('/api/contacts', (req, res) => {
  const selectSQL = `
    SELECT id, name, email, message, created_at 
    FROM contacts 
    ORDER BY created_at DESC
  `;
  
  db.all(selectSQL, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
    
    res.json({ contacts: rows });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

