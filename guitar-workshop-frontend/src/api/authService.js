import axiosInstance from './axiosInstance'

export const authService = {
  register: (data) => {
    return axiosInstance.post('/auth/register', data)
  },
  me: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }
    try {
      const response = await axiosInstance.get('/customers/me')
      return response.data
    } catch {
      return null
    }
  }
}
