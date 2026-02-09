import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchServices = createAsyncThunk(
  'services/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.services.getAll()
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createService = createAsyncThunk(
  'services/create', 
  async (service, { rejectWithValue }) => {
    try {
      const data = await api.services.create(service)
      return { ...service, id: data.id || data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const updateService = createAsyncThunk(
  'services/update', 
  async ({ id, service }, { rejectWithValue }) => {
    try {
      const result = await api.services.update(id, service)
      return { id, ...service }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteService = createAsyncThunk(
  'services/delete', 
  async (id, { rejectWithValue }) => {
    try {
      await api.services.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => { 
      state.error = null 
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchServices.pending, (state) => { 
        state.loading = true
        state.error = null 
      })
      .addCase(fetchServices.fulfilled, (state, action) => { 
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchServices.rejected, (state, action) => { 
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка завантаження'
      })
      
      // CREATE
      .addCase(createService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка створення'
      })
      
      // UPDATE
      .addCase(updateService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка оновлення'
      })
      
      // DELETE
      .addCase(deleteService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(i => i.id !== action.payload)
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка видалення'
      })
  }
})

export const { clearError } = servicesSlice.actions
export default servicesSlice.reducer
