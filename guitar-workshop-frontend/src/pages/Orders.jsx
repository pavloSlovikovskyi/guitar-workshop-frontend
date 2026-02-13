import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder
} from '../store/slices/ordersSlice'
import { fetchInstruments } from '../store/slices/instrumentsSlice'
import { fetchServices } from '../store/slices/servicesSlice'

export default function Orders() {
  const dispatch = useDispatch()

  const { items: orders = [], loading } = useSelector(s => s.orders)
  const { items: instruments = [] } = useSelector(s => s.instruments)
  const { items: services = [] } = useSelector(s => s.services)

  const [showForm, setShowForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  const [formData, setFormData] = useState({
    instrumentId: '',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'New',
    notes: ''
  })

  const [selectedServicesIds, setSelectedServicesIds] = useState([])

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchInstruments())
    dispatch(fetchServices())
  }, [dispatch])

  const resetForm = () => {
    setEditingOrder(null)
    setSelectedServicesIds([])
    setFormData({
      instrumentId: '',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'New',
      notes: ''
    })
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  const request = {
    instrumentId: formData.instrumentId,
    orderDate: formData.orderDate,
    status: formData.status,
    notes: formData.notes?.trim() || "-"
  }

  try {
    let orderId
    if (editingOrder) {
      const res = await dispatch(updateOrder({ id: editingOrder.id, request })).unwrap()
      orderId = editingOrder.id
    } else {
      const res = await dispatch(createOrder(request)).unwrap()
      orderId = res.id
    }

    // attach services
    for (const serviceId of selectedServicesIds) {
      await fetch(`/api/orders/${orderId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId })
      })
    }

    await dispatch(fetchOrders())
    alert('✅ Збережено!')
    setShowForm(false)
    resetForm()
  } catch (err) {
    console.error(err)
    alert('❌ ' + err.message)
  }
}



  const handleEdit = (order) => {
    if (!order) return

    setEditingOrder(order)
    setSelectedServicesIds(
      (order.services ?? []).map(s => s.id)
    )

    setFormData({
      instrumentId: order.instrumentId ?? '',
      orderDate: new Date(order.orderDate).toISOString().split('T')[0],
      status: order.status ?? 'New',
      notes: order.notes ?? ''
    })

    setShowForm(true)
  }

  const handleDelete = (order) => {
    if (confirm('Видалити замовлення?')) {
      dispatch(deleteOrder(order.id))
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">Завантажуємо замовлення... ⏳</div>
      </div>
    )
  }

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
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">
          📋 Замовлення ({orders.length})
        </h1>
        <button 
          onClick={() => { resetForm(); setShowForm(true) }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          disabled={loading}
        >
          + Додати замовлення
        </button>
      </div>

      {/* ФОРМА */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingOrder ? '✏️ Редагувати' : '➕ Додати'} замовлення
            </h2>
            <button 
              onClick={() => { setShowForm(false); resetForm() }} 
              className="text-2xl hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Інструмент *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата замовлення *
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={e => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус *
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Open">Нове</option>
                <option value="InProgress">В процесі</option>
                <option value="Completed">Завершене</option>
                <option value="Cancelled">Скасовано</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Примітки
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-vertical"
                placeholder="Додаткові примітки..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сервіси
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
                {services.map(service => {
                  const checked = selectedServicesIds.includes(service.id)
                  return (
                    <label key={service.id} className="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors">
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
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{service.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed font-bold transition-all"
              >
                {loading ? '⏳ Зберігаємо...' : (editingOrder ? 'Зберегти зміни' : 'Створити замовлення')}
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
      )}

      {/* СПИСОК */}
      {orders.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-2xl p-12 border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">Замовлень немає</h3>
          <p className="text-gray-500 mb-8">Додайте перше замовлення щоб почати роботу</p>
          <button 
            onClick={() => { resetForm(); setShowForm(true) }} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Додати перше
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => {
            const instrument = instruments.find(i => i.id === order.instrumentId)
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
                      onClick={() => handleEdit(order)} 
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" 
                      title="Редагувати"
                      disabled={loading}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(order)} 
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" 
                      title="Видалити"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="text-sm space-y-2 text-gray-600 divide-y divide-gray-100">
                  <div className="py-2 flex justify-between">
                    <span>Дата:</span>
                    <span>{order.orderDate ? 
                      new Date(order.orderDate).toLocaleDateString('uk-UA') : 
                      'Немає дати'
                    }</span>
                  </div>

                  {order.notes && (
                    <div className="py-2">
                      <span>Примітки: </span>
                      <span className="font-medium text-gray-900">{order.notes}</span>
                    </div>
                  )}

                  {order.services?.length > 0 && (
                    <div className="py-2 pt-3">
                      <span className="font-medium text-gray-900 block mb-1">Сервіси:</span>
                      <div className="flex flex-wrap gap-1">
                        {(order.services ?? []).map(s => (
                          <span
                            key={s.id}
                            className="px-2 py-1 bg-gray-100 text-xs rounded font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
