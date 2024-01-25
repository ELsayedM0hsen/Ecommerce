import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
const getImportNotes = async () => {
  const response = await axios.get(`${base_url}importNote/`);

  return response.data;
};

const createImportNote = async (importNote) => {
  const response = await axios.post(`${base_url}importNote/`, importNote, config);

  return response.data;
};

const getImportNote = async (id) => {
  const response = await axios.get(`${base_url}importNote/${id}`, config);

  return response.data;
};

// const data = { id: getImportNoteId, importNoteData: values };
const updateImportNote = async (importNote) => {
  const response = await axios.put(
    `${base_url}importNote/${importNote.id}`, importNote.importNoteData, config);

  return response.data;
};

const deleteImportNote = async (id) => {
  const response = await axios.delete(`${base_url}importNote/${id}`, config);

  return response.data;
};

const importNoteService = {
  getImportNotes,
  createImportNote,
  getImportNote,
  updateImportNote,
  deleteImportNote,
};

export default importNoteService;