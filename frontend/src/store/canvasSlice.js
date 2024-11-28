import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pixels: {},
  selectedColor: '#000000',
  loading: false,
  error: null,
}

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setPixels: (state, action) => {
      state.pixels = action.payload
    },
    updatePixel: (state, action) => {
      const { x, y, color } = action.payload
      state.pixels[`${x},${y}`] = color
    },
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setPixels,
  updatePixel,
  setSelectedColor,
  setLoading,
  setError,
} = canvasSlice.actions

export default canvasSlice.reducer
