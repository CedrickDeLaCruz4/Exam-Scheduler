const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'admission'
});

// Get all available exam slots (not full)
app.get('/exam_slots', (req, res) => {
  const sql = `SELECT * FROM exam_schedule WHERE current_applicants < 50`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error fetching slots' });
    res.json(results);
  });
});

// Add a new exam slot
app.post('/add_exam_slot', (req, res) => {
  const { exam_date, start_time, end_time } = req.body;

  if (!exam_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required (date, start time, end time).' });
  }

  const sql = `
    INSERT INTO exam_schedule (exam_date, start_time, end_time, current_applicants)
    VALUES (?, ?, ?, 0)
  `;
  db.query(sql, [exam_date, start_time, end_time], (err, result) => {
    if (err) {
      console.error('Error inserting new exam slot:', err);
      return res.status(500).json({ error: 'Failed to add exam slot' });
    }
    res.json({ message: 'Slot added successfully' });
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));
