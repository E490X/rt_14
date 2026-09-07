import { createSlice } from '@reduxjs/toolkit';
import config from 'config';

export const customizationSlice = createSlice({
  name: 'customization',
  initialState: {
    isOpen: [],
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
  },
  reducers: {
    menuOpen: (state, action) => {
      const id = action.payload.id;
      state.isOpen = [id];
    },
    setMenu: (state, action) => {
      state.opened = action.payload.opened;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload.fontFamily;
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload.borderRadius;
    },
  },
});

export const { menuOpen, setMenu, setFontFamily, setBorderRadius } = customizationSlice.actions;

export default customizationSlice.reducer;
