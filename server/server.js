const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors middleware
const nodemailer = require('nodemailer');
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'millionsafari07@gmail.com',
    pass: 'safaricom',
  },
});

app.post('/send-email', async (req, res) => {
  const { subject, text } = req.body;

  try {
    // Fetch email addresses from the database
    const users = await fetchUsersFromDatabase();

    // Send emails to all users
    for (const user of users) {
      const info = await transporter.sendMail({
        from: 'million@blihmarketing.com',
        to: user.email,
        subject,
        text,
      });

      console.log(`Email sent to ${user.name} (${user.email}):`, info.response);
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mock function to fetch users from the database
function fetchUsersFromDatabase() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_crud',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Define routes here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


 
// Create employee
app.post('/employees', (req, res) => {
    const { name, email, work } = req.body;
    const sql = 'INSERT INTO employees (name, email, work) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, work], (err, results) => {
      if (err) {
        console.error('Error creating employee:', err);
        res.status(500).send('Error creating employee');
      } else {
        res.status(201).json({ id: results.insertId, name, email, work });
      }
    });
  });
  
  // Read all employees
  app.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM employees';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Error fetching employees');
      } else {
        res.json(results);
      }
    });
  });
  
  // Update employee
  app.put('/employees/:id', (req, res) => {
    const { name, email, work } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE employees SET name=?, email=?, work=? WHERE id=?';
    connection.query(sql, [name, email, work, id], (err) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).send('Error updating employee');
      } else {
        res.status(200).send('Employee updated successfully');
      }
    });
  });
  
  // Delete employee
  app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employees WHERE id=?';
    connection.query(sql, [id], (err) => {
      if (err) {
        console.error('Error deleting employee:', err);
        res.status(500).send('Error deleting employee');
      } else {
        res.status(200).send('Employee deleted successfully');
      }
    });
  });
  
   
  