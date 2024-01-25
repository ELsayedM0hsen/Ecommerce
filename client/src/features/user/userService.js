import axios from "axios";
import { base_url, config } from "../../utils/axiosconfig";

const register = async (userData) => {
  const response = await axios.post(`${base_url}user/register`, userData);

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${base_url}user/login`, userData);
  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
  }
  return response.data;
};

const changePassword = async (userData) => {
  const response = await axios.put(
    `${base_url}user/password`,
    userData,
    config
  );

  return response.data;
};

const getUserWishlist = async (data) => {
  const response = await axios.get(`${base_url}user/wishlist`, data, config);
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await axios.post(`${base_url}user/cart`, cartData, config);
  if (response.data) {
    return response.data;
  }
};

const getCart = async (data) => {
  const response = await axios.get(`${base_url}user/cart`, data);
  if (response.data) {
    return response.data;
  }
};

const removeProductFromCart = async (data) => {
  const response = await axios.delete(
    `${base_url}user/delete-product-cart/${data.id}`,
    data.config2
  );
  if (response.data) {
    return response.data;
  }
};

const emptyCart = async () => {
  const response = await axios.delete(`${base_url}user/empty-cart`, config);
  if (response.data) {
    return response.data;
  }
};

const updateProductFromCart = async (cartDetail) => {
  const response = await axios.delete(
    `${base_url}user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
    config
  );
  if (response.data) {
    return response.data;
  }
};

const createOrder = async (orderDetail) => {
  console.log("orderDetail", orderDetail);
  const response = await axios.post(
    `${base_url}user/cart/create-order`,
    orderDetail,
    config
  );
  if (response.data) {
    return response.data;
  }
};

const cancelOrder = async (data) => {
  // console.log("config", config);
  // console.log("config.headers", config.headers);
  // console.log("config.headers.Authorization", config.headers.Authorization);
  const response = await axios.put(
    `${base_url}user/cancelOrder/${data._id}`,
    { orderItems: data.orderItems },
    config
  );
  if (response.data) {
    return response.data;
  }
};

const updateOrder = async (data) => {
  const response = await axios.put(
    `${base_url}user/updateOrder/${data.id}`,
    { status: data.status },
    config
  );

  return response.data;
};

const getUserOrders = async () => {
  const response = await axios.get(`${base_url}user/getmyorders`, config);
  if (response.data) {
    return response.data;
  }
};

const getAOrder = async (id) => {
  const response = await axios.get(`${base_url}user/getaOrder/${id}`, config);
  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
  const response = await axios.put(`${base_url}user/edit-user`, data, config);
  if (response.data) {
    return response.data;
  }
};

// send email want reset password
const forgotPassToken = async (data) => {
  const response = await axios.post(
    `${base_url}user/forgot-password-token`,
    data
  );
  if (response.data) {
    return response.data;
  }
};

// send new password
const resetPass = async (data) => {
  const response = await axios.put(
    `${base_url}user/reset-password/${data.token}`,
    { password: data?.password }
  );
  if (response.data) {
    return response.data;
  }
};

const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${base_url}user/refresh`, {
    refreshToken: refreshToken,
  });
  if (response.data) {
    return response.data;
  }
};

export const authService = {
  register,
  login,
  changePassword,
  getUserWishlist,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  createOrder,
  getUserOrders,
  getAOrder,
  cancelOrder,
  updateOrder,
  updateUser,
  forgotPassToken,
  resetPass,
  emptyCart,
  refreshToken,
};
