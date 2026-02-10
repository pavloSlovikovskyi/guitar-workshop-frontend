import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll', 
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const orders = await api.orders.getAll()
      
      // 🔥 Завантажуємо послуги для кожного замовлення
      const ordersWithServices = await Promise.all(
        orders.map(async (order) => {
          try {
            // const services = await api.orders.getServices(order.id)
            return { ...order, services: [] } // Поки порожні
          } catch {
            return order
          }
        })
      )
      
      return ordersWithServices
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const createOrder = createAsyncThunk(
  'orders/create', 
  async (orderData, { rejectWithValue }) => {
    try {
      const result = await api.orders.create(orderData)
      return { ...orderData, id: result.id || crypto.randomUUID() }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateOrder = createAsyncThunk(
  'orders/update', 
  async ({ id, orderData }, { rejectWithValue }) => {
    console.log('🔍 SLICE UPDATE ID:', id, typeof id)  // 🔥 ДІАГНОСТИКА!
    
    try {
      const result = await api.orders.update(String(id), orderData)  // 🔥 STRING!
      return { id: String(id), ...orderData }  // 🔥 Повертаємо STRING ID!
    } catch (error) {
      return rejectWithValue(error.message)
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
