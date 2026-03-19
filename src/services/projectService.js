// services/projectService.js
import API from '../api/axios';

export const getAllProjects      = ()          => API.get('/projects');
export const getProjectById     = (id)        => API.get(`/projects/${id}`);
export const createProject      = (data)      => API.post('/projects', data);
export const updateProject      = (id, data)  => API.put(`/projects/${id}`, data);
export const deleteProject      = (id)        => API.delete(`/projects/${id}`);
export const changeProjectStatus = (id, status) => API.patch(`/projects/${id}/status`, { status });