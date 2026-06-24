import axiosInstance from './axiosInstance'

export const downloadOrdersReport = (format) => {
  console.log('Downloading format:', format)
  return axiosInstance.get('/reports/orders', {
    params: { format },
    responseType: 'blob'
  })
}
