import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../../api/axiosInstance'

const getRoleFromToken = (token) => {
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    const roleClaim =
      decoded.role ||
      decoded.roles ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/roles']

    let role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim
    if (typeof role === 'string' && role.includes(',')) {
      role = role.split(',')[0].trim()
    }
    return role || null
  } catch {
    return null
  }
}

const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken')
const storedRole = localStorage.getItem('userRole') || getRoleFromToken(storedToken)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })

      const { token } = response.data
      const role = getRoleFromToken(token)

      // Зберігаємо токен та роль у localStorage
      localStorage.setItem('token', token)
      localStorage.removeItem('authToken')
      if (role) {
        localStorage.setItem('userRole', role)
      } else {
        localStorage.removeItem('userRole')
      }

      return {
        token,
        role,
        email: credentials.email
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })

      return {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!storedToken,
    token: storedToken || null,
    role: storedRole || null,
    email: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.role = null
      state.email = null
      state.error = null

      // Очищуємо localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Server Response:', action.payload)
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.role = action.payload.role
        state.email = action.payload.email
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.email = action.payload.email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
