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

// Memory abstraction utilizing Multer securely passing binaries to fs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

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

router.post('/upload', authMiddleware, upload.single('resume'), uploadAndParse);
router.post('/analyze', authMiddleware, executeAnalysis);
router.post('/job-match', authMiddleware, executeJobMatch);
router.get('/:id', authMiddleware, getAnalysisResult);

module.exports = router;
