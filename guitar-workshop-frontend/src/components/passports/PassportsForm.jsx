export default function PassportsForm({ 
  formData, instruments, editingPassport, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingPassport ? '✏️ Редагувати' : '➕ Додати'} техпаспорт
        </h2>
        <button onClick={() => { setShowForm(false); resetForm() }} className="text-2xl hover:text-gray-600" disabled={loading}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Інструмент *</label>
          <select 
            name="instrumentId" 
            value={formData.instrumentId} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Дата видачі *</label>
          <input 
            name="issueDate" 
            type="date" 
            value={formData.issueDate} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Деталі</label>
          <textarea 
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
            placeholder="Стан інструменту, ремонт, особливості..."
          />
        </div>
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 font-bold">
            {loading ? '⏳ Зберігаємо...' : (editingPassport ? 'Зберегти зміни' : 'Створити паспорт')}
          </button>
          <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 px-6 rounded-lg font-medium">
            Скасувати
          </button>
        </div>
      </form>
    </div>
  )
}
