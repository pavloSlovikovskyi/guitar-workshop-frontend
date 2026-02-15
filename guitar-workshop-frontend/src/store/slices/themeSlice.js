import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    }
  }
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
