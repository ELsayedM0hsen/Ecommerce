// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import importNoteService from "./importNoteService";

// actions
export const getImportNotes = createAsyncThunk(
  "importNote/get-importNotes",
  async (thunkAPI) => {
    try {
      return await importNoteService.getImportNotes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createImportNote = createAsyncThunk(
  "importNote/create-importNotes",
  async (importNoteData, thunkAPI) => {
    try {
      return await importNoteService.createImportNote(importNoteData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAImportNote = createAsyncThunk(
  "importNote/get-importNote",
  async (id, thunkAPI) => {
    try {
      return await importNoteService.getImportNote(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateAImportNote = createAsyncThunk(
  "importNote/update-importNote",
  async (importNote, thunkAPI) => {
    try {
      return await importNoteService.updateImportNote(importNote);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteAImportNote = createAsyncThunk(
  "importNote/delete-importNote",
  async (id, thunkAPI) => {
    try {
      return await importNoteService.deleteImportNote(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  importNotes: [], // importNotes
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// reducers
export const importNoteSlice = createSlice({
  name: "importNotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getImportNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImportNotes.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.importNotes = action.payload;
        state.message = "success";
      })
      .addCase(getImportNotes.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(createImportNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createImportNote.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.createdImportNote = action.payload;
        state.message = "success";
      })
      .addCase(createImportNote.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getAImportNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAImportNote.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.supplierID = action.payload.nameSupplier;
        state.importNoteBrand = action.payload.brand;
        state.importNoteQuantity = action.payload.quantity;
        state.importNotePrice = action.payload.price;
        state.message = "success";
      })
      .addCase(getAImportNote.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(updateAImportNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAImportNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedImportNote = action.payload;
      })
      .addCase(updateAImportNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(deleteAImportNote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAImportNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedImportNote = action.payload;
      })
      .addCase(deleteAImportNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState);
  }
})

export default importNoteSlice.reducer;