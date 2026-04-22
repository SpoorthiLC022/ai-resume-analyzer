const { getDB } = require('../config/db');

class ResumeModel {
  static async createResume(userId, filePath, parsedText) {
    const db = getDB();
    const [result] = await db.query(
      'INSERT INTO resumes (user_id, file_path, parsed_text) VALUES (?, ?, ?)',
      [userId, filePath, parsedText]
    );
    return result.insertId;
  }

  static async getResumeById(id) {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM resumes WHERE id = ?', [id]);
    return rows[0];
  }
}

class AnalysisModel {
  static async createAnalysis(resumeId, score, skills, missingKeywords, suggestions) {
    const db = getDB();
    const [result] = await db.query(
      'INSERT INTO analysis (resume_id, score, skills, missing_keywords, suggestions) VALUES (?, ?, ?, ?, ?)',
      [
        resumeId, 
        score, 
        JSON.stringify(skills), 
        JSON.stringify(missingKeywords), 
        JSON.stringify(suggestions)
      ]
    );
    return result.insertId;
  }

  static async updateJobMatch(analysisId, jobMatchScore) {
    const db = getDB();
    await db.query(
      'UPDATE analysis SET job_match_score = ? WHERE id = ?',
      [jobMatchScore, analysisId]
    );
  }

  static async getAnalysisByResumeId(resumeId) {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM analysis WHERE resume_id = ?', [resumeId]);
    if (rows[0]) {
      // Parse JSON fields securely
      try { rows[0].skills = JSON.parse(rows[0].skills); } catch(e){}
      try { rows[0].missing_keywords = JSON.parse(rows[0].missing_keywords); } catch(e){}
      try { rows[0].suggestions = JSON.parse(rows[0].suggestions); } catch(e){}
    }
    return rows[0];
  }
}

module.exports = { ResumeModel, AnalysisModel };
