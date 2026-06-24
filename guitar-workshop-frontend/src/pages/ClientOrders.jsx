import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../store/slices/ordersSlice'

const statusStyles = {
  New: 'bg-black text-white',
  Open: 'bg-black text-white',
  InProgress: 'bg-black text-white',
  Completed: 'bg-black text-white',
  Cancelled: 'bg-black text-white'
}

export default function ClientOrders() {
  const dispatch = useDispatch()
  const { items: orders = [], loading } = useSelector((s) => s.orders)
  const { items: instruments = [] } = useSelector((s) => s.instruments)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const getInstrumentModel = (order) => {
    return (
      order.instrumentModel ||
      order.instrument?.model ||
      instruments.find((i) => i.id === order.instrumentId)?.model ||
      'Невідомо'
    )
  }

  const getTotal = (order) => {
    return (order.services ?? []).reduce((sum, service) => sum + (service.price || 0), 0)
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-black">Завантажуємо замовлення...</div>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-10 text-left">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter border-b-8 border-black pb-4 mb-12">Мої замовлення</h1>

      {orders.length === 0 ? (
        <div className="bg-white border-2 border-black p-8 text-black">
          У вас поки що немає замовлень.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusClass = statusStyles[order.status] || 'bg-black text-white'
            const isExpanded = expandedId === order.id

            return (
              <div
                key={order.id}
                className="bg-white border-2 border-black cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedId(isExpanded ? null : order.id)
                  }
                }}
              >
                <div className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-black">Інструмент</p>
                    <p className="text-2xl font-black uppercase tracking-tighter">{getInstrumentModel(order)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase px-3 py-1 ${statusClass}`}>
                      {order.status || 'Невідомо'}
                    </span>
                    <span className="text-sm text-black">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('uk-UA') : '—'}
                    </span>
                    <span className="text-sm font-bold text-black">
                      {getTotal(order).toLocaleString('uk-UA')} грн
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t-2 border-black p-6 bg-white">
                    <p className="text-xs font-bold uppercase text-black mb-3">Послуги</p>
                    {(order.services ?? []).length === 0 ? (
                      <p className="text-sm text-black">Послуги не вказані.</p>
                    ) : (
                      <ul className="space-y-2">
                        {(order.services ?? []).map((service) => (
                          <li key={service.id} className="flex items-center justify-between text-sm text-black">
                            <span>{service.title || service.name || 'Послуга'}</span>
                            <span className="font-bold">{(service.price || 0).toLocaleString('uk-UA')} грн</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
