import axiosInstance from '../axiosInstance'

/**
 * Завантажує звіт про замовлення в указаному форматі
 * @param {string} format - Формат звіту: 'Pdf', 'Excel', 'Word'
 * @returns {Promise<void>}
 */
export const downloadOrdersReport = async (format = 'Excel') => {
  try {
    const response = await axiosInstance.get('/reports/orders', {
      params: { format },
      responseType: 'blob' // Важливо для отримання файлу
    })

    // Визначаємо розширення файлу на основі формату
    const fileExtensions = {
      Pdf: 'pdf',
      Excel: 'xlsx',
      Word: 'docx'
    }

    const extension = fileExtensions[format] || 'bin'
    const fileName = `orders-report-${new Date().toISOString().split('T')[0]}.${extension}`

    // Створюємо об'єкт Blob з отриманих даних
    const url = URL.createObjectURL(response.data)

    // Створюємо тимчасовий елемент <a> для завантаження
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)

    // Запускаємо завантаження
    link.click()

    // Очищуємо ресурси
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Помилка при завантаженні звіту:', error)
    throw new Error(`Не вдалося завантажити звіт: ${error.message}`)
  }
}

/**
 * Альтернативна функція для отримання звіту як Blob (без автоматичного завантаження)
 * @param {string} format - Формат звіту: 'Pdf', 'Excel', 'Word'
 * @returns {Promise<Blob>}
 */
export const getOrdersReportBlob = async (format = 'Excel') => {
  try {
    const response = await axiosInstance.get('/reports/orders', {
      params: { format },
      responseType: 'blob'
    })

    return response.data
  } catch (error) {
    console.error('Помилка при отриманні звіту:', error)
    throw new Error(`Не вдалося отримати звіт: ${error.message}`)
  }
}
