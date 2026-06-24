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
  <div className="bg-white p-8 border-2 border-black rounded-none">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
        {editingOrder ? 'Редагувати' : 'Додати'} замовлення
      </h2>
      <button 
        onClick={onCancel} 
        className="text-2xl text-black"
      >
        ×
      </button>
    </div>
    
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-bold uppercase text-black mb-2">Інструмент *</label>
        <select
          value={formData.instrumentId}
          onChange={e => setFormData(prev => ({ ...prev, instrumentId: e.target.value }))}
          className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
          required
        >
          <option value="">-- Оберіть інструмент --</option>
          {instruments.map(i => (
            <option key={i.id} value={i.id}>{i.model}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-black mb-2">Дата замовлення *</label>
        <input
          type="date"
          value={formData.orderDate}
          onChange={e => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
          className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-black mb-2">Статус *</label>
        <select
          value={formData.status}
          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
        >
          <option value="New">Нове</option>
          <option value="InProgress">В процесі</option>
          <option value="Completed">Завершене</option>
          <option value="Cancelled">Скасовано</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-bold uppercase text-black mb-2">Примітки</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none resize-vertical"
          placeholder="Додаткові примітки..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-bold uppercase text-black mb-2">Сервіси</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border-2 border-black">
          {services.map(service => {
            const checked = selectedServicesIds.includes(service.id)
            return (
              <label key={service.id} className="flex items-center p-3 border-2 border-black cursor-pointer transition-all">
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
                  className="w-4 h-4 mr-3 accent-black"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-black break-words whitespace-normal overflow-wrap-anywhere block">
                    {service.title || service.name}
                  </span>
                  <span className="text-xs text-black font-bold uppercase">
                    {service.price?.toLocaleString('uk-UA')} грн
                  </span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="border-2 border-black p-6 text-center">
          <div className="text-sm font-bold uppercase text-black mb-2">
            Вибрано сервісів: {selectedServicesIds.length}
          </div>
          <div className="text-3xl font-black text-black mb-2">
            {totalPrice.toLocaleString('uk-UA')} грн
          </div>
          <div className="text-sm text-black">
            Загальна вартість замовлення
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex gap-4 pt-2">
        <button 
          type="submit" 
          disabled={loading || totalPrice === 0}
          className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
        >
          {loading ? '⏳ Зберігаємо...' : (editingOrder ? 'Зберегти зміни' : 'Створити замовлення')}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={loading}
          className="flex-1 w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
        >
          Скасувати
        </button>
      </div>
    </form>
  </div>
)

export default OrderForm
