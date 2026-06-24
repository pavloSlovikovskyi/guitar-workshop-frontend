export default function PassportsForm({ 
  formData, instruments, editingPassport, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  return (
    <div className="bg-white p-8 border-2 border-black rounded-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
          {editingPassport ? 'Редагувати' : 'Додати'} техпаспорт
        </h2>
        <button onClick={() => { setShowForm(false); resetForm() }} className="text-2xl text-black" disabled={loading}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Інструмент *</label>
          <select 
            name="instrumentId" 
            value={formData.instrumentId} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
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
          <label className="block text-xs font-bold uppercase text-black mb-2">Дата видачі *</label>
          <input 
            name="issueDate" 
            type="date" 
            value={formData.issueDate} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-black mb-2">Деталі</label>
          <textarea 
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows={4}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none resize-vertical"
            placeholder="Стан інструменту, ремонт, особливості..."
          />
        </div>
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
            {loading ? '⏳ Зберігаємо...' : (editingPassport ? 'Зберегти зміни' : 'Створити паспорт')}
          </button>
          <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
            Скасувати
          </button>
        </div>
      </form>
    </div>
  )
}
