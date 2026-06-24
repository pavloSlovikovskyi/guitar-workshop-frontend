export default function CustomersForm({ 
  formData, editingCustomer, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  return (
    <div className="bg-white p-8 border-2 border-black rounded-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
          {editingCustomer ? 'Редагувати' : 'Додати'} клієнта
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
        {/* ✅ 1. ІМ'Я */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Ім'я *</label>
          <input 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
            placeholder="Іван"
          />
        </div>

        {/* ✅ 2. ПРІЗВИЩЕ */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Прізвище *</label>
          <input 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
            placeholder="Петров"
          />
        </div>

        {/* ✅ 3. ТЕЛЕФОН */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Телефон *</label>
          <input 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
            placeholder="+380 67 123 45 67"
          />
        </div>

        {/* ✅ 4. EMAIL */}
        <div>
          <label className="block text-xs font-bold uppercase text-black mb-2">Email *</label>
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleInputChange}
            className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none" 
            required 
            placeholder="example@email.com"
          />
        </div>

        {/* ✅ 5. КНОПКИ */}
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          >
            {loading ? '⏳ Зберігаємо...' : (editingCustomer ? 'Зберегти зміни' : 'Створити клієнта')}
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
