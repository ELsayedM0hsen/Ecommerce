// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import uploadService from "./uploadService";
import { toast } from "react-toastify";

export const resetStateUpload = createAction("Reset_all-upload-img");

const initialState = {
  images: [], // images
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// actions
export const uploadImg = createAsyncThunk(
  "upload/images",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData(); // backend  req.files
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      return await uploadService.uploadImg(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const delImg = createAsyncThunk(
  "delete/images",
  async (id, thunkAPI) => {
    try {
      return await uploadService.deleteImg(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// reducers
export const uploadSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadImg.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.images = action.payload;
        state.message = "success";
      })
      .addCase(uploadImg.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(delImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delImg.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.deletedImage = action.payload;
        state.message = "success";
        if (state.isSuccess === true) {
          toast.success("Img Deleted Successfully");
        }
      })
      .addCase(delImg.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.isLoading = false;
      })

      .addCase(resetStateUpload, () => initialState);
  },
});

export default uploadSlice.reducer;
