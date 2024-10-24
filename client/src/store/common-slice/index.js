import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const addFeatureImage = createAsyncThunk(
  "/feature/addFeatureImage",
  async (image) => {
    console.log(image);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
      { image },
    );
    return response.data;
  },
);
export const getFeatureImage = createAsyncThunk(
  "/feature/getFeatureImage",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/feature/get`,
    );
    return response.data;
  },
);
export const deleteFeatureImage = createAsyncThunk(
  "/feature/deleteFeatureImage",
  async (featureId) => {
    // try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/common/feature/delete/${featureId}`,
    );
    return response.data;
    // } catch (error) {

    // }
  },
);

const commnSlice = createSlice({
  name: "commnSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commnSlice.reducer;
