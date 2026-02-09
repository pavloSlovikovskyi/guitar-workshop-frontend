import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchPassports, 
  createPassport, 
  updatePassport, 
  deletePassport, 
  clearError 
} from '../store/slices/passportsSlice'
import { fetchInstruments } from '../store/slices/instrumentsSlice'

export default function Passports() {
  const dispatch = useDispatch()
  const { items: passports, loading, error } = useSelector(state => state.passports)
  const instruments = useSelector(state => state.instruments.items)
  
  
  // 🔥 Точно як у Instruments!
  const [editingPassport, setEditingPassport] = useState(null)
  const [formData, setFormData] = useState({
    instrumentId: '',
    issueDate: new Date().toISOString().split('T')[0],
    details: ''
  })
  const [showForm, setShowForm] = useState(false)

  // Об'єднані дані з інструментами
// 🔥 НАЙБІЛЬШ ВАЖЛИВЕ - БЕЗПЕЧНИЙ useMemo (рядки 243-254)
const passportsWithInstruments = useMemo(() => {
  // ✅ ЗАХИСТ ВІД NULL/UNDEFINED
  if (!Array.isArray(passports)) return []
  if (!Array.isArray(instruments)) return []
  
  return passports
    .filter(passport => passport && passport.id) // ✅ ФІЛЬТР НЕПРАВИЛЬНИХ
    .map(passport => {
      const instrument = instruments.find(i => i && i.id === passport.instrumentId)
      return {
        ...passport,
        instrumentName: instrument?.model || 'Не знайдено',
        instrumentSerial: instrument?.serialNumber || 'N/A',
        customerId: instrument?.customerId || null,
        // ✅ БЕЗПЕЧНИЙ ID
        shortId: passport.id ? passport.id.slice(-4) : 'XXXX'
      }
    })
}, [passports, instruments])

  useEffect(() => {
    dispatch(fetchPassports())
    dispatch(fetchInstruments())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      instrumentId: '',
      issueDate: new Date().toISOString().split('T')[0],
      details: ''
    })
    setEditingPassport(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    const submitData = {
      instrumentId: formData.instrumentId,
      issueDate: `${formData.issueDate}T00:00:00Z`,
      details: formData.details.trim()
    }
    
    if (editingPassport) {
      const result = await dispatch(updatePassport({ 
        id: editingPassport.id, 
        passportData: submitData 
      }))
      if (updatePassport.rejected.match(result)) {
        alert('❌ Оновлення не вдалося')
        return
      }
    } else {
      const result = await dispatch(createPassport({ 
        instrumentId: submitData.instrumentId, 
        passportData: submitData 
      }))
      if (createPassport.rejected.match(result)) {
        alert('❌ Створення не вдалося')
        return
      }
      resetForm()
    }
    
    setShowForm(false)
  }, [dispatch, formData, editingPassport, resetForm])

  const handleEdit = useCallback((passport) => {
    setEditingPassport(passport)
    setFormData({
      instrumentId: passport.instrumentId,
      issueDate: passport.issueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      details: passport.details || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (confirm('Видалити техпаспорт?')) {
      dispatch(deletePassport(id))
    }
  }, [dispatch])

  if (loading && passports.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">Завантажуємо паспорти... ⏳</div>
      </div>
    )
  }

  return (
    
        
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок - ТОЧНО ЯК У INSTRUMENTS */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">
          📋 Техпаспорти
        </h1>
        <button 
          onClick={() => { setShowForm(true); resetForm() }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          disabled={loading}
        >
          + Додати паспорт
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

      {/* ФОРМА - ТОЧНО ЯК У INSTRUMENTS (з modal поведінкою) */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingPassport ? '✏️ Редагувати' : '➕ Додати'} техпаспорт
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
                Інструмент *
              </label>
              <select 
                name="instrumentId" 
                value={formData.instrumentId} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required
              >
                <option value="">Виберіть інструмент</option>
                {instruments.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.model} ({inst.serialNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата видачі *
              </label>
              <input 
                name="issueDate" 
                type="date" 
                value={formData.issueDate} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
                required 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Деталі
              </label>
              <textarea 
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Стан інструменту, ремонт, особливості..."
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all"
              >
                {loading ? '⏳ Зберігаємо...' : (editingPassport ? 'Зберегти зміни' : 'Створити паспорт')}
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

      {/* СПИСОК - ТОЧНО ЯК У INSTRUMENTS */}
      {passportsWithInstruments.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-2xl p-12 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">Техпаспортів немає</h3>
          <p className="text-gray-500 mb-8">Додайте перший паспорт для інструменту</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Додати перший
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passportsWithInstruments.map((passport) => (
            <div 
              key={passport.id} 
              className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate" title={passport.instrumentName}>
                    {passport.instrumentName}
                  </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                        Паспорт #{passport.shortId || 'XXXX'}
                    </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                  <button 
                    onClick={() => handleEdit(passport)} 
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" 
                    title="Редагувати"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(passport.id)} 
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
                  <span className="font-mono">{passport.instrumentSerial}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span>Дата видачі:</span>
                  <span>{new Date(passport.issueDate).toLocaleDateString('uk-UA')}</span>
                </div>
                {passport.customerId && (
                  <div className="py-1 flex justify-between">
                    <span>Клієнт:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {passport.customerId}
                    </span>
                  </div>
                )}
                {passport.details && (
                  <div className="py-2 pt-3">
                    <span className="font-medium block mb-1">Деталі:</span>
                    <p className="text-xs bg-gray-50 p-2 rounded text-gray-700 leading-relaxed">
                      {passport.details}
                    </p>
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
