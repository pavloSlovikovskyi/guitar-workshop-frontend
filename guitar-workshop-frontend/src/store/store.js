import { configureStore } from '@reduxjs/toolkit'
import instrumentsReducer from './slices/instrumentsSlice'
import customersReducer from './slices/customersSlice'
import servicesReducer from './slices/servicesSlice'
import passportsReducer from './slices/passportsSlice'

export const store = configureStore({
  reducer: {
    instruments: instrumentsReducer,
    customers: customersReducer,
    services: servicesReducer,
    passports: passportsReducer
  }
})

export default store
