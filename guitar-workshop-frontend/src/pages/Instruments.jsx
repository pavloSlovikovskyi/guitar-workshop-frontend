import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchInstruments, 
  createInstrument, 
  updateInstrument, 
  deleteInstrument, 
  clearError 
} from '../store/slices/instrumentsSlice'

export default function Instruments() {
  const dispatch = useDispatch()
  const { items: instruments, loading, error } = useSelector(state => state.instruments)
  
  // Форма
  const [editingInstrument, setEditingInstrument] = useState(null)
  const [formData, setFormData] = useState({
    model: '',
    serialNumber: '',
    recieveDate: new Date().toISOString().split('T')[0],
    status: 'InRepair',
    customerId: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchInstruments())
  }, [dispatch])

  const statusOptions = [
    { value: 'Ready', label: 'Готова' },
    { value: 'InRepair', label: 'На ремонті' },
    { value: 'WaitingParts', label: 'Очікує запчастин' },
    { value: 'Delivered', label: 'Видана' }
  ]

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      model: '',
      serialNumber: '',
      recieveDate: new Date().toISOString().split('T')[0],
      status: 'InRepair',
      customerId: ''
    })
    setEditingInstrument(null)
  }, [])

const handleSubmit = useCallback(async (e) => {
  e.preventDefault()
  
  const apiData = {
    Model: formData.model.trim(),
    SerialNumber: formData.serialNumber.trim(),
    Status: formData.status,
    CustomerId: formData.customerId.trim() || null,
    RecieveDate: `${formData.recieveDate}T00:00:00Z`
  }
  
  try {
    if (editingInstrument) {
      await dispatch(updateInstrument({ 
        id: editingInstrument.id, 
        instrument: apiData 
      })).unwrap()
    } else {
      await dispatch(createInstrument(apiData)).unwrap()
    }
    
    // 🔥 АВТООНОВЛЕННЯ СПИСКУ!
    await dispatch(fetchInstruments())
    
    alert('✅ Збережено!')
    setShowForm(false)
    resetForm()
    
  } catch (err) {
    alert('❌ ' + err.message)
  }
}, [dispatch, formData, editingInstrument])





  const handleEdit = useCallback((instrument) => {
    setEditingInstrument(instrument)
    setFormData({
      model: instrument.model || '',
      serialNumber: instrument.serialNumber || '',
      recieveDate: instrument.recieveDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: instrument.status || 'InRepair',
      customerId: instrument.customerId?.toString() || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (confirm('Видалити інструмент?')) {
      dispatch(deleteInstrument(id))
    }
  }, [dispatch])

  const getStatusColor = useCallback((status) => {
    const colors = {
      'Ready': 'bg-green-100 text-green-800',
      'InRepair': 'bg-yellow-100 text-yellow-800',
      'WaitingParts': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }, [])

  const getStatusLabel = useCallback((status) => {
    const labels = {
      'Ready': 'Готова',
      'InRepair': 'На ремонті',
      'WaitingParts': 'Очікує запчастин',
      'Delivered': 'Видана'
    }
    return labels[status] || status
  }, [])

  if (loading && instruments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">Завантажуємо інструменти... ⏳</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">
          🎸 Інструменти ({instruments.length})
        </h1>
        <button 
          onClick={() => { setShowForm(true); resetForm() }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          disabled={loading}
        >
          + Додати інструмент
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
              {editingInstrument ? '✏️ Редагувати' : '➕ Додати'} інструмент
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
                Модель *
              </label>
              <input 
                name="model" 
                value={formData.model} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Серійний номер *
              </label>
              <input 
                name="serialNumber" 
                value={formData.serialNumber} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата прийому *
              </label>
              <input 
                name="recieveDate" 
                type="date" 
                value={formData.recieveDate} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус *
              </label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID клієнта (опціонально)
              </label>
              <input 
                name="customerId" 
                value={formData.customerId} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all"
              >
                {loading ? '⏳ Зберігаємо...' : (editingInstrument ? 'Зберегти зміни' : 'Створити інструмент')}
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
      {instruments.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-2xl p-12 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🎸</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">Інструментів немає</h3>
          <p className="text-gray-500 mb-8">Додайте перший інструмент щоб почати роботу</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Додати перший
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument) => (
            <div 
              key={instrument.id} 
              className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate" title={instrument.model}>
                    {instrument.model}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(instrument.status)}`}>
                    {getStatusLabel(instrument.status)}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                  <button 
                    onClick={() => handleEdit(instrument)} 
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" 
                    title="Редагувати"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(instrument.id)} 
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" 
                    title="Видалити"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="text-sm space-y-1 text-gray-600 divide-y divide-gray-100">
                <div className="py-1 flex justify-between">
                  <span>Серійний №:</span>
                  <span className="font-mono">{instrument.serialNumber}</span>
                </div>
                <div className="py-1">
                  <span>Дата: </span>
                  <span>{instrument.recieveDate ? 
                    new Date(instrument.recieveDate).toLocaleDateString('uk-UA') : 
                    'Немає дати'
                  }</span>
                </div>
                {instrument.customerId && (
                  <div className="py-1">
                    <span>Клієнт: </span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {instrument.customerId}
                    </span>
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
