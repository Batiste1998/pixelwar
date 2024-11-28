import axios from '../utils/axiosConfig'

export const getCanvas = async () => {
  const response = await axios.get('/pixels/canvas')
  return response.data
}

export const placePixel = async (x, y, color) => {
  const response = await axios.post('/pixels/place', { x, y, color })
  return response.data
}
