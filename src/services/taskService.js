// import axios from "axios";

// const API = "http://localhost:3000/bugs";

// export const getBugs = async () => {
//   return axios.get(API);
// };

// export const createBug = async (bugData) => {
//   return axios.post(API, bugData);
// };

// export const getBugById = async (id) => {
//   return axios.get(`${API}/${id}`);
// };

// export const updateBug = async (id, data) => {
//   return axios.put(`${API}/${id}`, data);
// };

// export const deleteBug = async (id) => {
//   return axios.delete(`${API}/${id}`);
// };


// services/bugService.js


// services/taskService.js  ← rename from bugService
import API from '../api/axios';

export const getAllTasks   = (filters = {}) => API.get('/tasks', { params: filters });
export const getTaskById  = (id)           => API.get(`/tasks/${id}`);
export const createTask   = (data)         => API.post('/tasks', data);
export const updateTask   = (id, data)     => API.put(`/tasks/${id}`, data);
export const deleteTask   = (id)           => API.delete(`/tasks/${id}`);
export const assignTask   = (id, devId)    => API.patch(`/tasks/${id}/assign`, { developerId: devId });
export const submitTask   = (id)           => API.patch(`/tasks/${id}/submit`);
