// Defined Actions, Reducer and Save State

import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import authService from "./authServices";
import { toast } from "react-toastify";

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const resetState = createAction("Reset_all");

const initialState = {
  user: getUserfromLocalStorage, // user
  orders: [], // orders
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// create a actions Redux
// function login nhan vao bien userData, bien thunkAPI la đối tượng cung cấp các phương thức để xử lý các trạng thái yêu cầu
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getMonthlyData = createAsyncThunk(
  "orders/monthlydata",
  async (data, thunkAPI) => {
    try {
      return await authService.getMonthlyOrders(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getYearlyData = createAsyncThunk(
  "orders/yearlydata",
  async (data, thunkAPI) => {
    try {
      return await authService.getYearlyStats(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCategoryRevenueData = createAsyncThunk(
  "orders/categoryRevenueData",
  async (data, thunkAPI) => {
    try {
      return await authService.getCategoryRevenueData(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrderStatusCounts = createAsyncThunk(
  "orders/orderStatusCounts",
  async (data, thunkAPI) => {
    try {
      return await authService.getOrderStatusCounts(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPaymentMethodCounts = createAsyncThunk(
  "orders/paymentMethodCounts",
  async (data, thunkAPI) => {
    try {
      return await authService.getPaymentMethodCounts(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCountLowStockProducts = createAsyncThunk(
  "orders/countOutOfStockProducts",
  async (data, thunkAPI) => {
    try {
      return await authService.getCountLowStockProducts(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getInventoryStatsByCategory = createAsyncThunk(
  "orders/inventoryStatsByCategory",
  async (data, thunkAPI) => {
    try {
      return await authService.getInventoryStatsByCategory(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  "order/get-orders",
  async (data, thunkAPI) => {
    try {
      return await authService.getOrders(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      return await authService.getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAOrder = createAsyncThunk(
  "order/update-order",
  async (data, thunkAPI) => {
    try {
      return await authService.updateOrder(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteAOrder = createAsyncThunk(
  "order/delete-order",
  async (id, thunkAPI) => {
    try {
      return await authService.deleteOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const blockUser = createAsyncThunk(
  "customer/block-customer",
  async (id, thunkAPI) => {
    try {
      return await authService.blockUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const unBlockUser = createAsyncThunk(
  "customer/unBlock-customer",
  async (id, thunkAPI) => {
    try {
      return await authService.unBlockUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken, thunkAPI) => {
    try {
      return await authService.refreshToken(refreshToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// create a Reducer Redux
// 1 actions co 3 reducers
export const authSlice = createSlice({
  name: "auth", // name State
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "success";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = "success";
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.singleOrder = action.payload;
        state.message = "success";
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getMonthlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.monthlyData = action.payload;
        state.message = "success";
      })
      .addCase(getMonthlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getYearlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getYearlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.yearlyData = action.payload;
        state.message = "success";
      })
      .addCase(getYearlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getCategoryRevenueData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryRevenueData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.categoryRevenueData = action.payload;
        state.message = "success";
      })
      .addCase(getCategoryRevenueData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getOrderStatusCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderStatusCounts.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orderStatusCountsData = action.payload;
        state.message = "success";
      })
      .addCase(getOrderStatusCounts.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getPaymentMethodCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaymentMethodCounts.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentMethodCountsData = action.payload;
        state.message = "success";
      })
      .addCase(getPaymentMethodCounts.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getCountLowStockProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCountLowStockProducts.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.countLowStockProducts = action.payload;
        state.message = "success";
      })
      .addCase(getCountLowStockProducts.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(getInventoryStatsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventoryStatsByCategory.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.inventoryStatsByCategory = action.payload;
        state.message = "success";
      })
      .addCase(getInventoryStatsByCategory.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(updateAOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.updatedOrder = action.payload;
        state.message = "success";
        if (state.isSuccess === true) {
          toast.success("Cập nhật thành công trạng thái đơn hàng")
        }
      })
      .addCase(updateAOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      .addCase(deleteAOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedOrder = action.payload;
      })
      .addCase(deleteAOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(blockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blockedUser = action?.payload?.message;
        if (state.isSuccess === true) {
          toast.success("Khách hàng đã bị Khóa")
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(unBlockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.unBlockedUser = action?.payload?.message;
        if (state.isSuccess === true) {
          toast.success("Khách hàng đã Hoạt động")
        }
      })
      .addCase(unBlockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.refreshToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        console.log(action.error);
      })

      .addCase(resetState, () => initialState);
  },
})

export default authSlice.reducer;