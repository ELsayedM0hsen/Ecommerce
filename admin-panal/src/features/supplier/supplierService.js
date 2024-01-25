import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
const getSuppliers = async () => {
  const response = await axios.get(`${base_url}supplier/`);

  return response.data;
};

const createSupplier = async (supplier) => {
  const response = await axios.post(`${base_url}supplier/`, supplier, config);

  return response.data;
};

const getSupplier = async (id) => {
  const response = await axios.get(`${base_url}supplier/${id}`, config);

  return response.data;
};

// const data = { id: getSupplierId, supplierData: values };
const updateSupplier = async (supplier) => {
  const response = await axios.put(
    `${base_url}supplier/${supplier.id}`, supplier.supplierData, config);

  return response.data;
};

const deleteSupplier = async (id) => {
  const response = await axios.delete(`${base_url}supplier/${id}`, config);

  return response.data;
};

const supplierService = {
  getSuppliers,
  createSupplier,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierService;