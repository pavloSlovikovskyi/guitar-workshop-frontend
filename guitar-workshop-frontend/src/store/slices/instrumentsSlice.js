import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchInstruments = createAsyncThunk(
  'instruments/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.instruments.getAll()
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createInstrument = createAsyncThunk(
  'instruments/create', 
  async (instrument, { rejectWithValue }) => {
    try {
      const apiData = {
        Model: instrument.Model,
        SerialNumber: instrument.SerialNumber,
        Status: instrument.Status,
        CustomerId: instrument.CustomerId,
        RecieveDate: instrument.RecieveDate  // ✅ Залишаємо як є
      }
      
      const result = await api.instruments.create(apiData)
      
      // 🔥 ФІКС: ПРАВИЛЬНИЙ ФОРМАТ ДЛЯ РЕНДЕРУ!
      return {
        id: result?.id || crypto.randomUUID(),
        model: apiData.Model,
        serialNumber: apiData.SerialNumber,
        status: apiData.Status,
        customerId: apiData.CustomerId,
        recieveDate: apiData.RecieveDate  // ✅ camelCase для фронту
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)



export const updateInstrument = createAsyncThunk(
  'instruments/update', 
  async ({ id, instrument }, { dispatch, rejectWithValue }) => {
    try {
      // 🔥 1. Повне оновлення основних полів (PUT)
      const updateData = {
        Model: instrument.Model || instrument.model,
        SerialNumber: instrument.SerialNumber || instrument.serialNumber,
        CustomerId: instrument.CustomerId || instrument.customerId || null,
        RecieveDate: instrument.RecieveDate || instrument.recieveDate
      }
      
      await api.instruments.update(id, updateData)
      
      // 🔥 2. ОКРЕМЕ оновлення статусу (PATCH)!
      if (instrument.Status || instrument.status) {
        await api.instruments.updateStatus(id, instrument.Status || instrument.status)
      }
      
      // ✅ Повертаємо повний об'єкт
      return { 
        id, 
        Model: updateData.Model,
        SerialNumber: updateData.SerialNumber,
        Status: instrument.Status || instrument.status,
        CustomerId: updateData.CustomerId,
        RecieveDate: updateData.RecieveDate 
      }
    } catch (error) {
      console.error('🚨 UPDATE ERROR:', error)
      return rejectWithValue(error.message)
    }
  }
)



export const deleteInstrument = createAsyncThunk(
  'instruments/delete', 
  async (id, { rejectWithValue }) => {
    try {
      await api.instruments.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const instrumentsSlice = createSlice({
  name: 'instruments',
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
      .addCase(fetchInstruments.pending, (state) => { 
        state.loading = true
        state.error = null 
      })
      .addCase(fetchInstruments.fulfilled, (state, action) => { 
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchInstruments.rejected, (state, action) => { 
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка завантаження'
      })
      
      // CREATE
      .addCase(createInstrument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInstrument.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(createInstrument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка створення'
      })
      
      // UPDATE ✅ ВИПРАВЛЕНО!
      .addCase(updateInstrument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInstrument.fulfilled, (state, action) => {
        state.loading = false
        console.log('🔥 UPDATE PAYLOAD:', action.payload) // DEBUG
        
        // ✅ БЕЗПЕЧНА перевірка ID
        if (action.payload && action.payload.id) {
          const index = state.items.findIndex(i => i.id === action.payload.id)
          if (index !== -1) {
            state.items[index] = action.payload // ✅ Повний об'єкт
          }
        }
      })
      .addCase(updateInstrument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка оновлення'
      })
      
      // DELETE
      .addCase(deleteInstrument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteInstrument.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(i => i.id !== action.payload)
      })
      .addCase(deleteInstrument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Помилка видалення'
      })
  }
})

export const { clearError } = instrumentsSlice.actions
export default instrumentsSlice.reducer
