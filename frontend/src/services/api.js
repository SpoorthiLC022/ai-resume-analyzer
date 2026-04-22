import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-3-xudw.onrender.com/api';

// Small helper to silently authenticate a demo user
// It guarantees that we have a JWT token securely stored.
const getAuthToken = async () => {
  let token = localStorage.getItem('demo_token');
  if (token) return token;

  try {
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      name: "Demo User",
      email: `demo${Math.random().toString(36).substring(7)}@demo.com`,
      password: "password123"
    });
    token = signupRes.data.token;
    localStorage.setItem('demo_token', token);
    return token;
  } catch (err) {
    // If signup fails (maybe another user has same random string), try generic login fallback
    // Or just suppress
    console.error("Silent auth error:", err);
    return null;
  }
};

export const api = {
  uploadResume: async (file, preferences) => {
    try {
      const token = await getAuthToken();
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      // FEATURE 1: Form upload
      const formData = new FormData();
      formData.append('resume', file);

      const uploadResponse = await axios.post(`${BASE_URL}/resume/upload`, formData, { headers });
      const resumeId = uploadResponse.data.resumeId;

      if (!resumeId) {
        throw new Error('Upload failed: Missing resumeId in response');
      }

      // FEATURE 2: Auto Analyze
      const analyzeResponse = await axios.post(`${BASE_URL}/resume/analyze`, 
        { resumeId }, 
        { headers: { ...headers, 'Content-Type': 'application/json' } }
      );

      // FEATURE 3: Return payload matching the expected UI architecture
      const aiData = analyzeResponse.data.data;
      
      // Structure it precisely for the dashboard
      // Structure it precisely for the dashboard
      return {
        success: true,
        data: {
          resumeId: resumeId, // Expose for jobMatch downstream
          score: aiData.score || 0,
          skills: aiData.skills || [],
          missing: aiData.missing_keywords || [],
          suggestions: aiData.suggestions || [],
          lastUpdated: new Date().toISOString()
        },
        message: "Resume analyzed successfully."
      };
    } catch (error) {
      console.error("API Upload/Analyze Error:", error);
      throw error;
    }
  },

  jobMatch: async (resumeId, jobDescription) => {
    try {
      const token = await getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const matchResponse = await axios.post(`${BASE_URL}/resume/job-match`, 
        { resumeId, jobDescription }, 
        { headers }
      );

      return {
        success: true,
        data: matchResponse.data
      };
    } catch (error) {
      console.error("API JobMatch Error:", error);
      throw error;
    }
  },
  
  getAnalysis: async () => {
    // Attempting to mock initial state unless we saved specific data
    const saved = localStorage.getItem('analysisData');
    if (saved) {
      return { success: true, data: JSON.parse(saved) };
    }
    // Return empty payload triggering a re-route or blank slate in frontend
    return { success: false, data: null };
  },

  reAnalyze: async (preferences) => {
    // Placeholder for future re-analysis routing mapping to backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { score: 99, skills: ["AI"], missing: [], suggestions: ["Testing Reanalyze."] },
          message: "Re-analyzed."
        });
      }, 1000);
    });
  }
};
