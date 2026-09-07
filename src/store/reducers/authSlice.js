import { createSlice } from '@reduxjs/toolkit'

const localStorageValue = localStorage.getItem('rat-auth') 
const parsedValue = JSON.parse(localStorageValue)

const initialState = {
  loginToken: parsedValue
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginToken: (state, action) => {
      state.loginToken = action.payload
    },
    removeLoginToken: (state) => {
      state.loginToken = ''
    }
  }
})

export const { setLoginToken, removeLoginToken } = authSlice.actions
export default authSlice.reducer
