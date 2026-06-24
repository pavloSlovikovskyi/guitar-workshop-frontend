export default function ServicesForm({ 
  formData, editingService, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  return (
    <div className="bg-white p-8 border-2 border-black rounded-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
          {editingService ? 'Редагувати' : 'Додати'} послугу
        </h2>
        <button onClick={() => { setShowForm(false); resetForm() }} className="text-2xl text-black" disabled={loading}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Назва *</label>
          <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Ціна (грн) *</label>
          <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-black mb-2">Опис</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none resize-vertical" />
        </div>
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button type="submit" disabled={loading} className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
            {loading ? '⏳ Зберігаємо...' : (editingService ? 'Зберегти зміни' : 'Створити послугу')}
          </button>
          <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
            Скасувати
          </button>
        </div>
      </form>
    </div>
  )
}
