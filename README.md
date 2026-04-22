# AI-Based Resume Analyzer

A full-stack, production-ready SaaS application that leverages rule-based machine learning parameters to dynamically parse, assess, and score applicant resumes against targeted job descriptions to seamlessly identify Skill Gaps and ATS compatibility.

## 🚀 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, jsPDF
- **Backend**: Node.js, Express.js
- **Database**: MySQL (mysql2 driver)
- **Document Parsing**: pdf-parse, mammoth (docx)

## 🛠️ Setup Instructions

### 1. Database Configuration
1. Ensure your machine has **MySQL Server** installed.
2. In the `/backend` folder, duplicate `.env.example` as `.env`.
3. Input your `DB_USER` (e.g., \`root\`) and your \`DB_PASSWORD\`. The Node server natively runs `CREATE DATABASE IF NOT EXISTS resume_analyzer` automatically upon launch.

### 2. Run Backend
\`\`\`bash
cd backend
npm install
npm start
\`\`\`
*(Server boots dynamically on PORT 5000)*

### 3. Run Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(By default frontend points to \`http://localhost:5000/api\` securely unless \`VITE_API_URL\` is defined)*

## 🌍 Links
- **Live Frontend Deployment**: [Vercel Deployment Placeholder Placeholder]
- **Live Backend Deployment**: [Render Deployment Placeholder]
