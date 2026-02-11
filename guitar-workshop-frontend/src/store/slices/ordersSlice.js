import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.orders.getAll()
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)



// ordersSlice.js
export const createOrder = createAsyncThunk(
  'orders/create',
  async (request, { rejectWithValue }) => {
    try {
      const data = await api.orders.create(request)
      return data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({id, request}, { rejectWithValue }) => {
    try {
      await api.orders.update(id, request)
      return { id, ...request }
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)



export const deleteOrder = createAsyncThunk(
  'orders/delete', 
  async (id, { rejectWithValue }) => {
    try {
      await api.orders.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
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
    .addCase(fetchOrders.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload
    })
    .addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    
    // CREATE
    .addCase(createOrder.pending, (state) => {
      state.loading = true
    })
    .addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false
      state.items.push(action.payload)
    })
    .addCase(createOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    
    // UPDATE
    .addCase(updateOrder.pending, (state) => {
      state.loading = true
    })
    .addCase(updateOrder.fulfilled, (state, action) => {
      state.loading = false
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    })
    .addCase(updateOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    
    // DELETE — ТІЛЬКИ ОДИН!
    .addCase(deleteOrder.pending, (state) => {
      state.loading = true
    })
    .addCase(deleteOrder.fulfilled, (state, action) => {  // ✅ ТІЛЬКИ ОДИН!
      state.loading = false
      state.items = state.items.filter(item => item.id !== action.payload)
    })
    .addCase(deleteOrder.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
},

})

export const { clearError } = ordersSlice.actions
export default ordersSlice.reducer
