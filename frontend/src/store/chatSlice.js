import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  users: [],
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setMessages, addMessage, setUsers, setLoading, setError } =
  chatSlice.actions

export default chatSlice.reducer
