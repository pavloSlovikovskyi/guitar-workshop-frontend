const OrderForm = ({
  formData,
  setFormData,
  selectedServicesIds,
  setSelectedServicesIds,
  services,
  instruments,
  totalPrice,
  editingOrder,
  loading,
  onSubmit,
  onCancel
}) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl border">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {editingOrder ? '✏️ Редагувати' : '➕ Додати'} замовлення
      </h2>
      <button 
        onClick={onCancel} 
        className="text-2xl hover:text-gray-600 transition-colors"
      >
        ×
      </button>
    </div>
    
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Інструмент *</label>
        <select
          value={formData.instrumentId}
          onChange={e => setFormData(prev => ({ ...prev, instrumentId: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          required
        >
          <option value="">-- Оберіть інструмент --</option>
          {instruments.map(i => (
            <option key={i.id} value={i.id}>{i.model}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Дата замовлення *</label>
        <input
          type="date"
          value={formData.orderDate}
          onChange={e => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Статус *</label>
        <select
          value={formData.status}
          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        >
          <option value="New">Нове</option>
          <option value="InProgress">В процесі</option>
          <option value="Completed">Завершене</option>
          <option value="Cancelled">Скасовано</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Примітки</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-vertical"
          placeholder="Додаткові примітки..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Сервіси</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
          {services.map(service => {
            const checked = selectedServicesIds.includes(service.id)
            return (
              <label key={service.id} className="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedServicesIds(prev =>
                      checked
                        ? prev.filter(id => id !== service.id)
                        : [...prev, service.id]
                    )
                  }}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 mr-2 transition-all group-hover:scale-110"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 truncate block">
                    {service.title || service.name}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">
                    {service.price?.toLocaleString('uk-UA')} грн
                  </span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
          <div className="text-sm font-medium text-emerald-800 mb-2">
            Вибрано сервісів: {selectedServicesIds.length}
          </div>
          <div className="text-3xl font-bold text-emerald-700 mb-2">
            {totalPrice.toLocaleString('uk-UA')} грн
          </div>
          <div className="text-sm text-emerald-600">
            Загальна вартість замовлення
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex gap-4 pt-2">
        <button 
          type="submit" 
          disabled={loading || totalPrice === 0}
          className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? '⏳ Зберігаємо...' : (editingOrder ? 'Зберегти зміни' : 'Створити замовлення')}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="flex-1 bg-gray-300 disabled:bg-gray-200 hover:bg-gray-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-medium transition-all"
        >
          Скасувати
        </button>
      </div>
    </form>
  </div>
)

export default OrderForm
