const API_BASE = '/api' // 🔥 ВАЖЛИВО: заміни на реальний URL бекенду

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  const config = {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...(options.headers || {}) },
    ...options
  }
  
  const response = await fetch(`${API_BASE}${url}`, config)
  
  if (response.status === 204) {
    return null 
  }
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error ${response.status}: ${errorText || 'Unknown error'}`)
  }
  
  // ✅ Перевіряємо чи є body перед json()
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json()
    return data && data.value !== undefined ? data.value : data
  }
  
  return null
}

export const api = {
  customers: {
    getAll: () => apiRequest('/customers'),
    getById: (id) => apiRequest(`/customers/${id}`),
    create: (data) => apiRequest('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/customers/${id}`, { method: 'DELETE' })
  },
  
  instruments: {
  getAll: () => apiRequest('/instruments'),
  getById: (id) => apiRequest(`/instruments/${id}`),
  create: (data) => apiRequest('/instruments', { method: 'POST', body: JSON.stringify(data) }),
  
  // 🔥 ПОВНА версія з await + правильним return
  update: async (id, data) => {
    try {
      // 1. Повне оновлення (model, serialNumber, дата, customer)
      await apiRequest(`/instruments/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      });
      
      // 2. Оновлення статусу (окрема команда на бекенді)
      await api.instruments.updateStatus(id, data.status);
      
      // 3. ПОВЕРТАЄМ повний об'єкт для Redux slice
      return { 
        id, 
        model: data.model,
        serialNumber: data.serialNumber,
        status: data.status,
        customerId: data.customerId,
        recieveDate: data.recieveDate 
      };
    } catch (error) {
      console.error('❌ Update failed:', error);
      throw error; // Перекидаємо в Redux для обробки
    }
  },
  
  updateStatus: (id, status) => apiRequest(`/instruments/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }),
  
  delete: (id) => apiRequest(`/instruments/${id}`, { method: 'DELETE' })
},

orders: {
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),

  create: (data) => apiRequest('/orders', { 
    method: 'POST', 
    body: JSON.stringify({
      instrumentId: data.instrumentId,
      orderDate: `${data.orderDate}T00:00:00Z`,
      status: data.status,
      notes: data.notes?.trim() || "-"
    }) 
  }),

  update: (id, data) => apiRequest(`/orders/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify({
        instrumentId: data.instrumentId,
        orderDate: `${data.orderDate}T00:00:00Z`,
        status: data.status,
        notes: data.notes?.trim() || "-"
    }) 
  }),



  delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' })
},



  services: {
    getAll: () => apiRequest('/services'),
    create: (data) => apiRequest('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id, data) => { // 🔥 ТАКИЙ САМИЙ як для instruments!
      await apiRequest(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      return { id, ...data };
    },
    delete: (id) => apiRequest(`/services/${id}`, { method: 'DELETE' })
  },

  passports: {
    getAll: () => apiRequest('/instrument-passports'),      
    getById: (id) => apiRequest(`/instrument-passports/${id}`),
    create: (data) => apiRequest('/instrument-passports', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id, data) => apiRequest(`/instrument-passports/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id) => apiRequest(`/instrument-passports/${id}`, { 
      method: 'DELETE' 
    })
  }




}
