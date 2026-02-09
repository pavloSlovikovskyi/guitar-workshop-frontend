import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll', 
  async () => {
    const data = await api.customers.getAll()
    return Array.isArray(data) ? data : []
  }
)

export const createCustomer = createAsyncThunk(
  'customers/create', 
  async (customer) => {
    const data = await api.customers.create(customer)
    return { ...customer, id: data.id || data, createdAt: new Date().toISOString() }
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/update', 
  async ({ id, customer }) => {
    await api.customers.update(id, customer)
    return { id, customer }
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/delete', 
  async (id) => {
    await api.customers.delete(id)
    return id
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
      // FETCH
      .addCase(fetchCustomers.pending, (state) => { 
        state.loading = true; state.error = null 
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCustomers.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.error?.message || 'Помилка завантаження' 
      })
      // CREATE ✅ ВИПРАВЛЕНО
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload)  // ✅ Використовуємо повернуті дані
      })
      // UPDATE ✅
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload.customer
        }
      })
      // DELETE ✅
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload)
      })
      // ERROR HANDLING
      .addCase(createCustomer.rejected, (state, action) => { 
        state.error = action.error?.message || 'Помилка створення' 
      })
      .addCase(updateCustomer.rejected, (state, action) => { 
        state.error = action.error?.message || 'Помилка оновлення' 
      })
      .addCase(deleteCustomer.rejected, (state, action) => { 
        state.error = action.error?.message || 'Помилка видалення' 
      })
  }
})

export const { clearError } = customersSlice.actions
export default customersSlice.reducer
