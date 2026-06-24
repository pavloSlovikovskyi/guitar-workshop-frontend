const OrderList = ({ orders, instruments, services, calculateOrderTotal, onEdit, onDelete, loading }) => {
  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-black text-white',
      'InProgress': 'bg-black text-white',
      'Completed': 'bg-black text-white',
      'Cancelled': 'bg-black text-white'
    }
    return colors[status] || 'bg-black text-white'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
      {orders.map(order => {
        const instrument = instruments.find(i => i.id === order.instrumentId)
        const instrumentName = order.instrumentName?.trim() || instrument?.model || 'Інструмент не вказано'
        const orderTotal = calculateOrderTotal(order.services)
        
        return (
          <div 
            key={order.id} 
            className="border-2 border-black p-8 bg-white flex flex-col h-full min-h-[300px] justify-between rounded-none shadow-none"
          >
            <div className="flex-grow">
              <h3 className="text-2xl font-black uppercase mb-2 break-words whitespace-normal overflow-wrap-anywhere" title={instrumentName}>
                {instrumentName}
              </h3>
              <span className={`px-3 py-1 text-xs font-bold uppercase inline-block ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>

              <div className="mt-4 space-y-2 text-sm font-medium leading-tight text-black">
                <div className="flex justify-between gap-4">
                  <span className="uppercase text-xs font-bold">Дата</span>
                  <span className="text-right">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('uk-UA') : 'Немає дати'}
                  </span>
                </div>

                {order.services?.length > 0 && (
                  <div>
                    <span className="uppercase text-xs font-bold block mb-1">Вартість</span>
                    <span className="text-2xl font-black text-black">
                      {orderTotal.toLocaleString('uk-UA')} грн
                    </span>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <span className="uppercase text-xs font-bold">Примітки</span>
                    <p className="text-sm font-medium leading-tight text-black break-words whitespace-normal overflow-wrap-anywhere">
                      {order.notes}
                    </p>
                  </div>
                )}

                {order.services?.length > 0 && (
                  <div>
                    <span className="uppercase text-xs font-bold block mb-2">
                      Сервіси ({order.services.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(order.services ?? []).map(s => {
                        const fullService = services.find(service => service.id === s.id)
                        return (
                          <span key={s.id} className="bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                            {s.title || s.name}
                            {fullService?.price && (
                              <span className="ml-2">
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

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => onEdit(order)}
                className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
                title="Редагувати"
                disabled={loading}
              >
                Редагувати
              </button>
              <button
                onClick={() => onDelete(order)}
                className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
                title="Видалити"
                disabled={loading}
              >
                Видалити
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderList
