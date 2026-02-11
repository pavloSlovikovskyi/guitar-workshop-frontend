import { configureStore } from '@reduxjs/toolkit'
import instrumentsReducer from './slices/instrumentsSlice'
import customersReducer from './slices/customersSlice'
import servicesReducer from './slices/servicesSlice'
import passportsReducer from './slices/passportsSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
    customers: customersReducer,
    services: servicesReducer,
    passports: passportsReducer,
    orders: ordersReducer
  }
})

export default store
