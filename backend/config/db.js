const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool;

const initDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log(`MySQL Connected to database: ${process.env.DB_NAME}`);

    await createTables();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
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