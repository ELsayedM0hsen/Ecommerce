import axios from "axios";
import { base_url } from "../../utils/axiosconfig";

const getCoupons = async () => {
  const response = await axios.get(`${base_url}coupon/`);
  return response.data;
};

const getCoupon = async (id) => {
  const response = await axios.get(`${base_url}coupon/${id}`);

  return response.data;
};

const couponService = {
  getCoupons,
  getCoupon,
};
export default couponService;
