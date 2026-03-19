// services/dashboardService.js
import API from '../api/axios';

export const getDashboardStats  = () => API.get('/admin/stats');
export const getRecentUsers     = () => API.get('/admin/recent-users');
export const getActiveProjects  = () => API.get('/admin/projects');