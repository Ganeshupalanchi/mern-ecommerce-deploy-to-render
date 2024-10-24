import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllOrders = createAsyncThunk("order/getAllOrders", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/admin/order/getOrders`,
  );
  return response.data;
});
export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (orderId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/order/details/${orderId}`,
    );
    return response.data;
  },
);
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/order/update/${orderId}`,
      { orderStatus },
    );
    return response.data;
  },
);
const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export default adminOrderSlice.reducer;
