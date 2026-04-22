const { ResumeModel, AnalysisModel } = require('../models/resumeModel');
const { parseResumeFile } = require('../utils/fileParser');
const { analyzeResume, jobMatch } = require('../utils/aiService');

const uploadAndParse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    
    // Parse the file asynchronously into raw text
    const parsedText = await parseResumeFile(filePath, mimetype);

    // Save record to DB tied to the JWT user
    const resumeId = await ResumeModel.createResume(req.user.id, filePath, parsedText);

    res.status(201).json({ 
      message: 'Resume uploaded and parsed successfully',
      resumeId,
      parsedTextPreview: parsedText.substring(0, 200) + '...'
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'File processing failed' });
  }
};

const executeAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ error: 'Resume ID required' });

    // Ensure resume belongs to user or fetch text
    const resume = await ResumeModel.getResumeById(resumeId);
    if (!resume || resume.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.parsed_text) {
         return res.status(400).json({ error: 'Resume lacks parsed text' });
    }

    // Ping OpenAI
    const aiResult = await analyzeResume(resume.parsed_text);

    // Save to Analysis relational DB
    const analysisId = await AnalysisModel.createAnalysis(
      resumeId,
      aiResult.score,
      aiResult.skills,
      aiResult.missing_keywords,
      aiResult.suggestions
    );

    res.json({
      message: 'Analysis complete',
      analysisId,
      data: aiResult
    });
  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

const executeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: 'Resume ID and Job Description required' });
    }

    // Authenticate boundary
    const resume = await ResumeModel.getResumeById(resumeId);
    if (!resume || resume.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Resume not found' });
    }

    // Ping OpenAI matchmaking
    const matchResult = await jobMatch(resume.parsed_text, jobDescription);

    // Grab analysis record to update score
    const existingAnalysis = await AnalysisModel.getAnalysisByResumeId(resumeId);
    if (existingAnalysis) {
      await AnalysisModel.updateJobMatch(existingAnalysis.id, matchResult.match_percentage);
    }

    res.json(matchResult);
  } catch (error) {
    console.error('Job Match Error:', error);
    res.status(500).json({ error: 'Failed to evaluate job match' });
  }
};

const getAnalysisResult = async (req, res) => {
  try {
    const { id } = req.params; // resume_id
    
    // Auth boundary checking
    const resume = await ResumeModel.getResumeById(id);
    if (!resume || resume.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const analysis = await AnalysisModel.getAnalysisByResumeId(id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Fetch Analysis Error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};

module.exports = {
  uploadAndParse,
  executeAnalysis,
  executeJobMatch,
  getAnalysisResult
};
