import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addNewReview = createAsyncThunk(
  "/review/addNewReview",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/review/add`,

        formData,
      );
      return result?.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Pass custom error from backend
      }
      return rejectWithValue(error.message);
    }
  },
);
export const getReviews = createAsyncThunk(
  "/review/getReviews",
  async (productId) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`,
    );
    return result?.data;
  },
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
