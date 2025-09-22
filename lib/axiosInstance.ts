import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export const syncUser = createAsyncThunk("user/sync", async (clerkId: string) => {
  const res = await axiosInstance.get(`/users/${clerkId}`);
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(syncUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userSlice.reducer;
