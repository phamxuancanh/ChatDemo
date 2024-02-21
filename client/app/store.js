import userReducer from "../components/Home/userSlice";
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (
    getDefaultMiddleware 
  ) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
