import api from './api';

export const resumeService = {
  getStats: () => api.get('/resumes/stats/'),
  getAll: () => api.get('/resumes/'),
  getById: (id) => api.get(`/resumes/${id}/`),
  upload: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },
  delete: (id) => api.delete(`/resumes/${id}/`),
  download: (id) =>
    api.get(`/resumes/${id}/download/`, { responseType: 'blob' }),
};
