const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadAndParse, executeAnalysis, executeJobMatch, getAnalysisResult } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure uploads folder exists gracefully
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Secure Render environments mapping Buffer over ephemeral disk directories
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.mimetype === 'application/msword') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf and .docx format allowed!'), false);
    }
  }
});

router.post('/upload', upload.single('resume'), uploadAndParse);
router.post('/analyze', executeAnalysis);
router.post('/job-match', executeJobMatch);

module.exports = router;
