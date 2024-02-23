import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roomAPI from "../../api/roomAPI";

export const roomAfterLogin = createAsyncThunk(
  "/rooms/getRoomAfterLogin/",
  async () => {
    const data = await roomAPI.getRoomAfterLogin();
    return data.data;
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    current: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("room")) : {},
  },
  reducers: (builder) => {
    // Các reducers của bạn nếu có
  },

  extraReducers: (builder) => {
    builder
      .addCase(roomAfterLogin.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

const { reducer } = roomSlice;
export default reducer;
