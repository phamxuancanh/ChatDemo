import userReducer from "../components/Home/userSlice";
import roomReducer from "../components/Home/roomSlice";
// import listUserReduce from "../components/Home/form-addGroup/listUserSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = {
  user: userReducer,
  room: roomReducer,
  // listUser: listUserReduce,
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
