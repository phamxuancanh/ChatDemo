 import signinAPI from "../../pages/api/signinAPI";
import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const signin = createAsyncThunk("user/signin", async (payload) => {
    const data = await signinAPI.signIn(payload);

    if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    Cookies.set("token", data.data.accessToken);
    Cookies.set("refreshToken", data.data.refreshToken);

    return data.data.user;
});

const userSlice = createSlice({
    name: "user",
    initialState: {
      current: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : {},
    },
    reducers: (builder) => {
      // Các reducers của bạn nếu có
    },
    extraReducers: (builder) => {
      builder
        .addCase(signin.fulfilled, (state, action) => {
          state.current = action.payload;
        });
    },
  });
  

const { reducer } = userSlice;
export default reducer;
