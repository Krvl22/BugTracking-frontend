import axios from "axios";

const API = "http://localhost:5000/api";

export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard/stats`);
  return response.data;
};  