import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-analyzer-3-xudw.onrender.com";

export const api = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      `${BASE_URL}/api/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  },

  analyzeResume: async (resumeId) => {
    const res = await axios.post(
      `${BASE_URL}/api/analyze`,
      { resumeId }
    );

    return res.data;
  },

  jobMatch: async (resumeId, jobDescription) => {
    const res = await axios.post(
      `${BASE_URL}/api/job-match`,
      { resumeId, jobDescription }
    );

    return { success: true, data: res.data };
  }
};
