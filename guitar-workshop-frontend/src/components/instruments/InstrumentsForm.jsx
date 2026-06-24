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
    <div className="bg-white p-8 border-2 border-black rounded-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
          {editingInstrument ? 'Редагувати' : 'Додати'} інструмент
        </h2>
        <button 
          onClick={() => { setShowForm(false); resetForm() }} 
          className="text-2xl text-black"
          disabled={loading}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ 1. МОДЕЛЬ */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Модель *</label>
          <input 
            name="model" 
            value={formData.model} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
          />
        </div>

        {/* ✅ 2. СЕРІЙНИЙ НОМЕР */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Серійний номер *</label>
          <input 
            name="serialNumber" 
            value={formData.serialNumber} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
          />
        </div>

        {/* ✅ 3. ДАТА ПРИЙОМУ */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Дата прийому *</label>
          <input 
            name="recieveDate" 
            type="date" 
            value={formData.recieveDate} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
          />
        </div>

        {/* ✅ 4. СТАТУС */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Статус *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* ✅ 5. ID КЛІЄНТА */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">ID клієнта (опціонально)</label>
          <input 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
          />
        </div>

        {/* ✅ 6. КНОПКИ */}
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          >
            {loading ? '⏳ Зберігаємо...' : (editingInstrument ? 'Зберегти зміни' : 'Створити інструмент')}
          </button>
          <button 
            type="button" 
            onClick={() => { setShowForm(false); resetForm() }} 
            disabled={loading}
            className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  )
}
