import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteService, 
  clearError 
} from '../store/slices/servicesSlice'

export default function Services() {
  const dispatch = useDispatch()
  const { items: services, loading, error } = useSelector(state => state.services)
  
  // Форма
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationMinutes: '',
    description: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      price: '',
      durationMinutes: '',
      description: ''
    })
    setEditingService(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    const submitData = {
    // ✅ СТАЄ (для Backend):
    title: formData.name.trim(),        // Backend очікує Title
    price: parseFloat(formData.price) || 0,
    durationMinutes: parseInt(formData.durationMinutes) || 0,
    description: formData.description.trim()
  }
    
    if (editingService) {
      const result = await dispatch(updateService({ 
        id: editingService.id, 
        service: submitData 
      }))
      if (updateService.rejected.match(result)) {
        alert('❌ Оновлення не вдалося: ' + (result.payload || result.error?.message))
        return
      }
    } else {
      const result = await dispatch(createService(submitData))
      if (createService.rejected.match(result)) {
        alert('❌ Створення не вдалося: ' + (result.payload || result.error?.message))
        return
      }
    }
    
    resetForm()
    setShowForm(false)
  }, [dispatch, formData, editingService, resetForm])

  const handleEdit = useCallback((service) => {
    setEditingService(service)
    setFormData({
      name: service.name || '',
      price: service.price || '',
      durationMinutes: service.durationMinutes || '',
      description: service.description || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (confirm('Видалити послугу?')) {
      dispatch(deleteService(id))
    }
  }, [dispatch])

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH' 
    }).format(price)
  }, [])

  const formatDuration = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours ? `${hours}г ${mins}хв` : `${mins}хв`
  }, [])

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">Завантажуємо послуги... ⏳</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">
          🛠️ Послуги ({services.length})
        </h1>
        <button 
          onClick={() => { setShowForm(true); resetForm() }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          disabled={loading}
        >
          + Додати послугу
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
          <strong>Помилка:</strong> {error}
          <button 
            onClick={() => dispatch(clearError())} 
            className="ml-4 text-red-700 hover:text-red-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* ФОРМА */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingService ? '✏️ Редагувати' : '➕ Додати'} послугу
            </h2>
            <button 
              onClick={() => { setShowForm(false); resetForm() }} 
              className="text-2xl hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва *
              </label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ціна (грн) *
              </label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                value={formData.price} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тривалість (хв) *
              </label>
              <input 
                name="durationMinutes" 
                type="number" 
                value={formData.durationMinutes} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-vertical" 
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all"
              >
                {loading ? '⏳ Зберігаємо...' : (editingService ? 'Зберегти зміни' : 'Створити послугу')}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); resetForm() }} 
                disabled={loading}
                className="flex-1 bg-gray-300 disabled:bg-gray-200 hover:bg-gray-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-medium transition-all"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {/* СПИСОК */}
      {services.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-2xl p-12 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">Послуг немає</h3>
          <p className="text-gray-500 mb-8">Додайте першу послугу для ремонту інструментів</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Додати першу
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate" title={service.name}>
                    {service.name}
                  </h3>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {formatPrice(service.price)}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                  <button 
                    onClick={() => handleEdit(service)} 
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" 
                    title="Редагувати"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)} 
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" 
                    title="Видалити"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="text-sm space-y-2 text-gray-600 divide-y divide-gray-100">
                <div className="py-2 flex justify-between">
                  <span>Тривалість:</span>
                  <span className="font-medium">{formatDuration(service.durationMinutes)}</span>
                </div>
                {service.description && (
                  <div className="py-2 text-xs line-clamp-2" title={service.description}>
                    {service.description}
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
