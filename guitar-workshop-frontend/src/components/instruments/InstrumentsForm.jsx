export default function InstrumentsForm({ 
  formData, editingInstrument, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  const statusOptions = [
    { value: 'Ready', label: 'Готова' },
    { value: 'InRepair', label: 'На ремонті' },
    { value: 'WaitingParts', label: 'Очікує запчастин' },
    { value: 'Delivered', label: 'Видана' }
  ]

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingInstrument ? '✏️ Редагувати' : '➕ Додати'} інструмент
        </h2>
        <button 
          onClick={() => { setShowForm(false); resetForm() }} 
          className="text-2xl hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ 1. МОДЕЛЬ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Модель *</label>
          <input 
            name="model" 
            value={formData.model} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
          />
        </div>

        {/* ✅ 2. СЕРІЙНИЙ НОМЕР */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Серійний номер *</label>
          <input 
            name="serialNumber" 
            value={formData.serialNumber} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
          />
        </div>

        {/* ✅ 3. ДАТА ПРИЙОМУ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Дата прийому *</label>
          <input 
            name="recieveDate" 
            type="date" 
            value={formData.recieveDate} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
          />
        </div>

        {/* ✅ 4. СТАТУС */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Статус *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* ✅ 5. ID КЛІЄНТА */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID клієнта (опціонально)</label>
          <input 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
          />
        </div>

        {/* ✅ 6. КНОПКИ */}
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
  )
}
