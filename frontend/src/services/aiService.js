import api from './api';

export const aiService = {
  getRoles: () => api.get('/ai/roles/'),
  getResumeAI: (resumeId) => api.get(`/ai/resumes/${resumeId}/`),
  parseResume: (resumeId) => api.post(`/ai/resumes/${resumeId}/parse/`),
  analyzeResume: (resumeId) => api.post(`/ai/resumes/${resumeId}/analyze/`),
  skillGap: (resumeId, targetRole) =>
    api.post('/ai/skill-gap/', { resume_id: resumeId, target_role: targetRole }),
};
