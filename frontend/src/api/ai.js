import client from './client';

export const getRecommendations = () => client.post('/ai/recommendations/');
export const enhanceText = (text, context = 'project') => 
  client.post('/ai/enhance/', { text, context });
export const getSkillsAnalysis = (targetRole) => 
  client.post('/ai/skills-analysis/', { target_role: targetRole });
export const generateProjectDescription = (projectName, technologies, bulletPoints) =>
  client.post('/ai/project-description/', { project_name: projectName, technologies, bullet_points: bulletPoints });
