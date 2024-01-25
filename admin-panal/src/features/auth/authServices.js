import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from '../../utils/axiosconfig';

const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data;
};

const getOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getallorders`, data);

  return response.data;
};

const getOrder = async (id) => {
  const response = await axios.get(`${base_url}user/getaOrder/${id}`, config);

  return response.data;
};

const updateOrder = async (data) => {
  const response = await axios.put(`${base_url}user/updateOrder/${data.id}`, { status: data.status }, config);

  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(`${base_url}user/deleteOrder/${id}`, config);

  return response.data;
};

const getMonthlyOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getMonthWiseOrderIncome`, data);

  return response.data;
};

const getYearlyStats = async (data) => {
  const response = await axios.get(`${base_url}user/getYearlyTotalOrders`, data);

  return response.data;
};

const getCategoryRevenueData = async (data) => {
  const response = await axios.get(`${base_url}user/getCategoryRevenue`, data);

  return response.data;
};

const getOrderStatusCounts = async (data) => {
  const response = await axios.get(`${base_url}user/getOrderStatusCounts`, data);

  return response.data;
};

const getPaymentMethodCounts = async (data) => {
  const response = await axios.get(`${base_url}user/getPaymentMethodCounts`, data);

  return response.data;
};

const getCountLowStockProducts = async (data) => {
  const response = await axios.get(`${base_url}user/countLowStockProducts`, data);

  return response.data;
};

const getInventoryStatsByCategory = async (data) => {
  const response = await axios.get(`${base_url}user/inventoryStatsByCategory`, data);

  return response.data;
};

const blockUser = async (id) => {
  const response = await axios.put(`${base_url}user/block-user/${id}`, null, config);

  return response.data;
};

const unBlockUser = async (id) => {
  const response = await axios.put(`${base_url}user/unblock-user/${id}`, null, config);

  return response.data;
};

const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${base_url}user/refresh`, { refreshToken: refreshToken });
  if (response.data) {
    return response.data;
  }
};

const authService = {
  login,
  getOrders,
  getOrder,
  getMonthlyOrders,
  getYearlyStats,
  getCategoryRevenueData,
  getOrderStatusCounts,
  getPaymentMethodCounts,
  getCountLowStockProducts,
  getInventoryStatsByCategory,
  updateOrder,
  deleteOrder,
  blockUser,
  unBlockUser,
  refreshToken
}
export default authService;