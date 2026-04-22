const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool;

const initDB = async () => {
  // First, connect securely without defining the database name to conditionally create it
  const initConnection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  const dbName = process.env.DB_NAME || 'resume_analyzer';

  await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await initConnection.end();

  // Create the standard connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log(`MySQL Connected to database: ${dbName}`);

  // Create tables if they do not exist
  await createTables();
};

const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const resumesTable = `
    CREATE TABLE IF NOT EXISTS resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      parsed_text LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const analysisTable = `
    CREATE TABLE IF NOT EXISTS analysis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      score INT,
      skills JSON,
      missing_keywords JSON,
      suggestions TEXT,
      job_match_score INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    );
  `;

  await pool.query(usersTable);
  await pool.query(resumesTable);
  await pool.query(analysisTable);
  console.log('Tables verified/created successfully.');
};

const getDB = () => pool;

module.exports = { initDB, getDB };
