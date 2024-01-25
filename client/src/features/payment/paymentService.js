import axios from "axios";
import { base_url, config } from '../../utils/axiosconfig';

const getConfig = async () => {
  const response = await axios.get(`${base_url}payment/config`);
  if (response.data) {
    return response.data;
  }
};

export const paymentService = {
  getConfig,
}