import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/events/dashboard-stats`);
  return response.data;
};
