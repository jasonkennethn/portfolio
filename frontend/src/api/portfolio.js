import client from './client';

export const fetchPortfolioData = () => client.get('/portfolio/');

export const updateProfile = (id, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      if (val instanceof File) {
        formData.append(key, val);
      } else {
        formData.append(key, val);
      }
    }
  });
  return client.patch(`/profiles/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateConfig = (id, data) => client.patch(`/config/${id}/`, data);
export const updateSectionOrder = (sections) => client.post('/sections/reorder/', { sections });
export const updateSectionConfig = (id, data) => client.patch(`/sections/${id}/`, data);

export const uploadMediaFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client.post('/media/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const createSection = (data) => client.post('/sections/', data);
export const deleteSection = (id) => client.delete(`/sections/${id}/`);

export const createProject = (data) => client.post('/projects/', data);
export const updateProject = (id, data) => client.patch(`/projects/${id}/`, data);
export const deleteProject = (id) => client.delete(`/projects/${id}/`);

export const createExperience = (data) => client.post('/experiences/', data);
export const updateExperience = (id, data) => client.patch(`/experiences/${id}/`, data);
export const deleteExperience = (id) => client.delete(`/experiences/${id}/`);
