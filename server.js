// server.js
// A simple Express.js backend for a Todo list API

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// TODO ➡️  Middleware to inlcude static content from 'public' folder
app.use(express.static('public'));

// In-memory array to store todo items
let todos = [
  {
    id: 0,
    name: 'nina',
    priority: 'high',
    isComplete: false,
    isFun: false
  }
];
let nextId = 1;

//sqlite database
const db = new sqlite3.Database('todos.db', (err) => {
  if (err) {
    console.log(`Database error, ${err}`);
  }
  console.log('Database created.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS Todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT DEFAULT 'low',
    isFun TEXT DEFAULT 'true',
    isComplete INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      return console.error('Error creating table:', err.message);
    }
    console.log('Todos table created');
  }
);

// TODO ➡️ serve index.html from 'public' at the '/' path
app.get('/', (req, res) => {
  res.sendFile('index.html')
})


// TODO ➡️ GET all todo items at the '/todos' path

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM Todos', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Database error' });
    }
    res.json(rows);
  });
});


// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.all('SELECT * FROM Todos WHERE id = ?', id, (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Database error' });
    }
    else if (row) {
      res.json(row);
    }
    else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  });
});

// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = 'true' } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const insertQuery = `
  INSERT INTO Todos (name, priority, isFun)
  VALUES (?, ?, ?)
  `
  db.run(insertQuery, [name, priority, isFun], function(err) {
    if (err) {
      if (err) console.error('Failed to write to log:', err);
    }
    res.status(201).json(newTodo);
    });
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM Todos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ message: 'Failed to delete todo' });
    }
    res.json({ message: `Todo item ${id} deleted.` });
  });
});

// Start the server
// TODO ➡️ Start the server by listening on the specified PORT
app.listen(PORT, () => {
  console.log(`Todo API server running at http://localhost:${PORT}`)
})