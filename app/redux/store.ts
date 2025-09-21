import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import reportReducer from "./slices/reportSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    reports: reportReducer,
    transactions: transactionReducer,
  },
});

// types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
