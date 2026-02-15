const OrderList = ({ orders, instruments, services, calculateOrderTotal, onEdit, onDelete, loading }) => {
  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'InProgress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'New': 'Нове',
      'InProgress': 'В процесі',
      'Completed': 'Завершене',
      'Cancelled': 'Скасовано'
    }
    return labels[status] || status
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map(order => {
        const instrument = instruments.find(i => i.id === order.instrumentId)
        const orderTotal = calculateOrderTotal(order.services)
        
        return (
          <div 
            key={order.id} 
            className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-900 truncate" title={instrument?.model}>
                  {instrument?.model || 'Без інструменту'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                <button 
                  onClick={() => onEdit(order)} 
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" 
                  title="Редагувати"
                  disabled={loading}
                >
                  ✏️
                </button>
              </div>
            </div>

            <div className="text-sm space-y-2 text-gray-600 divide-y divide-gray-100">
              <div className="py-2 flex justify-between">
                <span>Дата:</span>
                <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('uk-UA') : 'Немає дати'}</span>
              </div>

              {order.services?.length > 0 && (
                <div className="py-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center mb-3">
                    <div className="text-xs font-medium text-emerald-800 mb-1">Вартість</div>
                    <div className="text-lg font-bold text-emerald-700">
                      {orderTotal.toLocaleString('uk-UA')} грн
                    </div>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="py-2">
                  <span>Примітки: </span>
                  <span className="font-medium text-gray-900">{order.notes}</span>
                </div>
              )}

              {order.services?.length > 0 && (
                <div className="py-2 pt-3">
                  <span className="font-medium text-gray-900 block mb-1">
                    Сервіси ({order.services.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(order.services ?? []).map(s => {
                      const fullService = services.find(service => service.id === s.id)
                      return (
                        <span key={s.id} className="px-2 py-1 bg-gray-100 text-xs rounded font-medium flex items-center gap-1">
                          {s.title || s.name}
                          {fullService?.price && (
                            <span className="text-emerald-600 font-bold text-[10px]">
                              {fullService.price.toLocaleString('uk-UA')}
                            </span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderList
