import axios from "axios";

const API = "http://localhost:3000/bugs";

export const getBugs = async () => {
  return axios.get(API);
};

export const createBug = async (bugData) => {
  return axios.post(API, bugData);
};

export const getBugById = async (id) => {
  return axios.get(`${API}/${id}`);
};

export const updateBug = async (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

export const deleteBug = async (id) => {
  return axios.delete(`${API}/${id}`);
};