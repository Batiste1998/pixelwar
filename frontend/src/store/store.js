import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import canvasReducer from './canvasSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canvas: canvasReducer,
    chat: chatReducer,
  },
})
