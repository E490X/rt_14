import { configureStore } from '@reduxjs/toolkit';
import {customizationSlice} from './reducers/customizationSlice';
import { authSlice } from './reducers/authSlice'

const store = configureStore({
  reducer: {
    customization: customizationSlice.reducer,
    auth: authSlice.reducer
  },
});

export default store;
