// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import supplierService from "./supplierService";

// actions
export const getSuppliers = createAsyncThunk(
  "supplier/get-suppliers",
  async (thunkAPI) => {
    try {
      return await supplierService.getSuppliers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createSupplier = createAsyncThunk(
  "supplier/create-suppliers",
  async (supplierData, thunkAPI) => {
    try {
      return await supplierService.createSupplier(supplierData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getASupplier = createAsyncThunk(
  "supplier/get-supplier",
  async (id, thunkAPI) => {
    try {
      return await supplierService.getSupplier(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateASupplier = createAsyncThunk(
  "supplier/update-supplier",
  async (supplier, thunkAPI) => {
    try {
      return await supplierService.updateSupplier(supplier);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteASupplier = createAsyncThunk(
  "supplier/delete-supplier",
  async (id, thunkAPI) => {
    try {
      return await supplierService.deleteSupplier(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  suppliers: [], // suppliers
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// reducers
export const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.suppliers = action.payload;
        state.message = "success";
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.createdSupplier = action.payload;
        state.message = "success";
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getASupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getASupplier.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.supplierName = action.payload.name;
        state.supplierEmail = action.payload.email;
        state.supplierMobile = action.payload.mobile;
        state.supplierAddress = action.payload.address;
        state.message = "success";
      })
      .addCase(getASupplier.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(updateASupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateASupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedSupplier = action.payload;
      })
      .addCase(updateASupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(deleteASupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteASupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedSupplier = action.payload;
      })
      .addCase(deleteASupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState);
  }
})

export default supplierSlice.reducer;