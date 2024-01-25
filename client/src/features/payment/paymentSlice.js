// /* eslint-disable no-lone-blocks */
// import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
// import { paymentService } from './paymentService';
// import { toast } from "react-toastify";

// export const getConfig = createAsyncThunk(
//   "payment/config",
//   async (thunkAPI) => {
//     try {
//       return await paymentService.getConfig();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const resetState = createAction("Reset_all");

// const initialState = {
//   config: ""
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState: initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getConfig.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getConfig.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isError = false;
//         state.isSuccess = true;
//         state.config = action.payload;
//       })
//       .addCase(getConfig.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.isSuccess = false;
//         state.message = action.error;
//       })

//       .addCase(resetState, () => initialState);
//   },
// })

// export default authSlice.reducer;