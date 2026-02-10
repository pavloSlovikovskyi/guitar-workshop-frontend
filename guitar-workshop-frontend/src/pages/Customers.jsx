import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  clearError 
} from '../store/slices/customersSlice'

export default function Customers() {
  const dispatch = useDispatch()
  
  const customersState = useSelector(state => state.customers)
  const customers = Array.isArray(customersState.items) ? customersState.items : []
  const loading = customersState.loading
  const error = customersState.error

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' })
    setEditingCustomer(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    if (editingCustomer) {
      await dispatch(updateCustomer({ 
        id: editingCustomer.id, 
        customer: formData 
      }))
    } else {
      await dispatch(createCustomer(formData))
      resetForm()
    }
    
    setShowForm(false)
    dispatch(fetchCustomers()) // 🔄 Перезавантажуємо список
  }, [dispatch, formData, editingCustomer, resetForm])

  const handleEdit = useCallback((customer) => {
    setEditingCustomer(customer)
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      phoneNumber: customer.phoneNumber || '',
      email: customer.email || ''
    })
    setShowForm(true)
  }, [])

  // 🔥 ВИПРАВЛЕНИЙ handleDelete
  const handleDelete = useCallback((customer) => {
    console.log('🗑️ Customer object:', customer)
    
    // ✅ Правильно витягуємо ID з API структури
    const customerId = customer.id?.value || customer.id
    
    console.log('🗑️ Customer ID:', customerId)
    
    if (!customerId) {
      alert('❌ ID не знайдено!')
      return
    }
    
    if (confirm(`Видалити ${customer.firstName} ${customer.lastName}?`)) {
      dispatch(deleteCustomer(customerId))
    }
  }, [dispatch])

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-600">Завантажуємо клієнтів... ⏳</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Клієнти ({customers.length})
        </h1>
        <button 
          onClick={() => { setShowForm(true); resetForm() }}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
          disabled={loading}
        >
          + Додати клієнта
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 p-6 rounded-2xl">
          <strong>Помилка:</strong> {error}
          <button 
            onClick={() => dispatch(clearError())} 
            className="ml-4 text-red-700 hover:text-red-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-gradient-to-r from-white to-gray-50 p-8 rounded-3xl shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {editingCustomer ? 'Редагувати клієнта' : 'Додати нового клієнта'}
            </h2>
            <button
              onClick={() => { setShowForm(false); resetForm() }}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ім'я *</label>
              <input
                name="firstName"
                placeholder="Введіть ім'я"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Прізвище *</label>
              <input
                name="lastName"
                placeholder="Введіть прізвище"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
              <input
                name="phoneNumber"
                placeholder="+380 XX XXX XX XX"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? '⏳ Зберігаємо...' : (editingCustomer ? 'Зберегти зміни' : 'Створити клієнта')}
              </button>
              <button 
                type="button"
                onClick={() => { setShowForm(false); resetForm() }}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {customers.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-8">👥</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">Клієнтів поки немає</h3>
          <p className="text-gray-500 mb-8">Додайте першого клієнта щоб почати роботу</p>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Додати першого клієнта
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {customers.map((customer, index) => (
            <div 
              key={`${customer.id?.value || customer.id || index}-${index}`} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 p-8 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <p className="text-blue-600 font-semibold text-lg mt-1">
                    {customer.email}
                  </p>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button 
                    onClick={() => handleEdit(customer)}  // ✅ ПРАВИЛЬНО!
                    className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    title="Редагувати"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* 🔥 ВИПРАВЛЕНА КНОПКА ВИДАЛЕННЯ */}
                  <button 
                    onClick={() => handleDelete(customer)}  // ✅ Передаємо customer!
                    className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    title="Видалити"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center">
                  <span className="font-medium w-20">Телефон:</span>
                  <span>{customer.phoneNumber}</span>
                </div>
                {customer.createdAt && (
                  <div className="flex items-center">
                    <span className="font-medium w-20">Створено:</span>
                    <span>{new Date(customer.createdAt).toLocaleDateString('uk-UA')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
