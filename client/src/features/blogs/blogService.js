import axios from "axios";
import { base_url } from '../../utils/axiosconfig';


const getBlogs = async (data) => {
  console.log(data);

  const response = await axios.get(`${base_url}blog?${data?.category ? `category=${data?.category}&&` : ""}`);
  if (response.data) {
    return response.data;
  }
};


const getBlog = async (id) => {
  const response = await axios.get(`${base_url}blog/${id}`);
  if (response.data) {
    return response.data;
  }
};

export const blogService = {
  getBlogs,
  getBlog
}