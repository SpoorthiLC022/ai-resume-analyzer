/**
 * FREE AI Resume Analyzer (No OpenAI Required)
 * Works using rule-based intelligent logic
 */

// Common skills database
const COMMON_SKILLS = [
  "java", "python", "javascript", "react", "node", "express",
  "mongodb", "sql", "html", "css", "git", "github",
  "aws", "docker", "kubernetes", "c++", "c", "typescript"
];

/**
 * Analyze Resume
 */
const analyzeResume = async (resumeText) => {
  try {
    const text = resumeText.toLowerCase();

    // ✅ Extract skills
    const foundSkills = COMMON_SKILLS.filter(skill =>
      text.includes(skill)
    );

    // ✅ Detect missing keywords (basic logic)
    const missingKeywords = COMMON_SKILLS.filter(skill =>
      !text.includes(skill)
    ).slice(0, 5);

    // ✅ ATS Score calculation
    let score = 40;

    score += foundSkills.length * 5;

    if (text.includes("project")) score += 10;
    if (text.includes("internship")) score += 10;
    if (text.includes("experience")) score += 10;
    if (text.includes("education")) score += 5;

    if (score > 95) score = 95;

    // ✅ Suggestions
    const suggestions = [];

    if (!text.includes("project")) {
      suggestions.push("Add at least 2 strong projects with clear descriptions.");
    }

    if (!text.includes("internship")) {
      suggestions.push("Include internship or real-world experience.");
    }

    if (foundSkills.length < 5) {
      suggestions.push("Add more relevant technical skills.");
    }

    if (!text.includes("achievement")) {
      suggestions.push("Include achievements or certifications.");
    }

    if (!text.includes("summary")) {
      suggestions.push("Add a professional summary at the top.");
    }

    return {
      score,
      skills: foundSkills,
      missing_keywords: missingKeywords,
      suggestions,
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("AI analysis failed.");
  }
};


/**
 * Job Match Function (FREE AI)
 */
const jobMatch = async (resumeText, jobDescription) => {
  try {
    const resume = resumeText.toLowerCase();
    const job = jobDescription.toLowerCase();

    const jobSkills = COMMON_SKILLS.filter(skill =>
      job.includes(skill)
    );

    const matchedSkills = jobSkills.filter(skill =>
      resume.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
      !resume.includes(skill)
    );

    // ✅ Match %
    let matchPercentage = 50;

    if (jobSkills.length > 0) {
      matchPercentage = Math.floor(
        (matchedSkills.length / jobSkills.length) * 100
      );
    }

    return {
      match_percentage: matchPercentage,
      missing_skills: missingSkills,
    };

  } catch (error) {
    console.error("Job Match Error:", error);
    throw new Error("AI job match failed.");
  }
};

module.exports = { analyzeResume, jobMatch };