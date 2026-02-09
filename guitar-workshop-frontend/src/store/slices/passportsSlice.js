import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchPassports = createAsyncThunk(
  'passports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const passports = await api.passports.getAll()
      return passports
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const fetchPassportByInstrument = createAsyncThunk(
  'passports/fetchByInstrument', 
  async (instrumentId, { rejectWithValue }) => {
    try {
      const data = await api.passports.getByInstrument(instrumentId)
      return data || null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// passportsSlice.js
export const createPassport = createAsyncThunk(
  'passports/create',
  async ({ instrumentId, passportData }, { dispatch, rejectWithValue }) => {
    try {
      const data = {
        instrumentId,
        issueDate: passportData.issueDate,
        details: passportData.details
      }
      await api.passports.create(data)
      
      // 🔥 ПЕРЕЗАВАНТАЖИ СПИСОК!
      await dispatch(fetchPassports())
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePassport = createAsyncThunk(
  'passports/update',
  async ({ id, passportData }, { rejectWithValue }) => {
    try {
      const data = {
        issueDate: passportData.issueDate,
        details: passportData.details
      }
      await api.passports.update(id, data)
      return { id, ...data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const deletePassport = createAsyncThunk(
  'passports/delete', 
  async (id, { rejectWithValue }) => {
    try {
      await api.passports.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const passportsSlice = createSlice({
  name: 'passports',
  initialState: {
    items: [],
    byInstrument: {},
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null },
    clearByInstrument: (state) => { state.byInstrument = {} }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPassports.pending, (state) => { 
        state.loading = true; state.error = null 
      })
      .addCase(fetchPassports.fulfilled, (state, action) => { 
        state.loading = false; state.items = action.payload 
      })
      .addCase(fetchPassports.rejected, (state, action) => { 
        state.loading = false; state.error = action.payload 
      })
      
      .addCase(fetchPassportByInstrument.fulfilled, (state, action) => {
        if (action.payload) {
          state.byInstrument[action.meta.arg] = action.payload
        }
      })
      
      .addCase(createPassport.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.byInstrument[action.payload.instrumentId] = action.payload
      })
      
      .addCase(updatePassport.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
        state.byInstrument[action.payload.instrumentId] = action.payload
      })
      
      .addCase(deletePassport.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload)
      })
  }
})

export const { clearError, clearByInstrument } = passportsSlice.actions
export default passportsSlice.reducer
