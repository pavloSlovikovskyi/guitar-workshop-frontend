export default function CustomersForm({ 
  formData, editingCustomer, showForm, setShowForm, 
  handleInputChange, handleSubmit, resetForm, loading 
}) {
  if (!showForm) return null

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingCustomer ? '✏️ Редагувати' : '➕ Додати'} клієнта
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
        {/* ✅ 1. ІМ'Я */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ім'я *</label>
          <input 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
            placeholder="Іван"
          />
        </div>

        {/* ✅ 2. ПРІЗВИЩЕ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Прізвище *</label>
          <input 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
            placeholder="Петров"
          />
        </div>

        {/* ✅ 3. ТЕЛЕФОН */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
          <input 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
            placeholder="+380 67 123 45 67"
          />
        </div>

        {/* ✅ 4. EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" 
            required 
            placeholder="example@email.com"
          />
        </div>

        {/* ✅ 5. КНОПКИ */}
        <div className="md:col-span-2 flex gap-4 pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all"
          >
            {loading ? '⏳ Зберігаємо...' : (editingCustomer ? 'Зберегти зміни' : 'Створити клієнта')}
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
