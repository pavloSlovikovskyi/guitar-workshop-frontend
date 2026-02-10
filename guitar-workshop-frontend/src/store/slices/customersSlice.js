import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.customers.getAll()
      
      return Array.isArray(data) ? data.map(customer => ({
        ...customer,
        // 🔥 ФІКС: витягуємо id.value!
        id: customer.id?.value || customer.id || customer._id || `temp-${Date.now()}`
      })) : []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customers/create', 
  async (customer, { rejectWithValue }) => {
    try {
      const data = await api.customers.create(customer)
      return { 
        ...customer, 
        id: data.id?.value || data.id || data,  // 🔥 ФІКС для create!
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/update', 
  async ({ id, customer }, { rejectWithValue }) => {
    try {
      await api.customers.update(id, customer)
      return { id, customer }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/delete', 
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Видаляємо ID:', id)
      
      const response = await fetch('https://localhost:7250/api/customers/' + id, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`DELETE ${response.status}: ${error}`)
      }
      
      return id
    } catch (error) {
      console.error('❌ DELETE error:', error)
      return rejectWithValue(error.message)
    }
  }
)


const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { 
        state.loading = true; state.error = null 
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload || 'Помилка завантаження' 
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.customer }
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload)
      })
  }
})

export const { clearError } = customersSlice.actions
export default customersSlice.reducer
