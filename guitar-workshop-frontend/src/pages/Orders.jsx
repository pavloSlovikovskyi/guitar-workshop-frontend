import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchOrders, createOrder, updateOrder, deleteOrder 
} from '../store/slices/ordersSlice'
import { fetchInstruments } from '../store/slices/instrumentsSlice'
import { fetchServices } from '../store/slices/servicesSlice'

export default function Orders() {
  const dispatch = useDispatch()
  const { items: orders = [], loading } = useSelector(state => state.orders || {})
  const { items: instruments = [] } = useSelector(state => state.instruments || {})
  const { items: services = [] } = useSelector(state => state.services || {})
  
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
    dispatch(fetchInstruments())
    dispatch(fetchServices())
    dispatch(fetchOrders())
  }, [dispatch])

  const resetForm = useCallback(() => {
    setFormData({
      instrumentId: '',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'New',
      notes: ''
    })
    setEditingOrder(null)
    setSelectedServicesIds([])
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const createOrderData = {
      request: {
        InstrumentId: formData.instrumentId,
        OrderDate: `${formData.orderDate}T00:00:00Z`,
        Status: formData.status,
        Notes: formData.notes.length > 0 ? formData.notes : " "
      }
    };
    
    console.log('🚀 SENDING:', createOrderData);
    
    try {
      let orderId;
      
      if (editingOrder) {
        orderId = editingOrder.id?.value || editingOrder.id;
        await dispatch(updateOrder({ 
          id: orderId, 
          request: createOrderData.request 
        })).unwrap();
      } else {
        const result = await dispatch(createOrder(createOrderData)).unwrap();
        orderId = result.id?.value || result.id || result.data?.id?.value;
      }
      
      console.log('✅ ORDER ID:', orderId);
      
      // Додаємо послуги
      if (selectedServicesIds.length > 0 && orderId) {
        for (const serviceId of selectedServicesIds) {
          await fetch(`/api/orders/${orderId}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ServiceId: serviceId })
          });
        }
      }
      
      await dispatch(fetchOrders());
      alert(`✅ Готово! (${selectedServicesIds.length} послуг)`);
      setShowForm(false);
      resetForm();
      
    } catch (error) {
      console.error('💥 ERROR:', error);
      alert(`❌ ${error.message}`);
    }
  }, [dispatch, formData, editingOrder, selectedServicesIds]);

  const handleEdit = useCallback((order) => {
    const orderId = order.id?.value || order.id || order.Id
    const instrumentId = order.instrumentId?.value || order.InstrumentId?.value || order.instrumentId
    
    setEditingOrder({ 
      ...order, 
      id: orderId,
      instrumentId 
    })
    setFormData({
      instrumentId,
      orderDate: new Date(order.orderDate || order.OrderDate).toISOString().split('T')[0],
      status: order.status || order.Status || 'New',
      notes: order.notes || order.Notes || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((order) => {
    const orderId = order.id?.value || order.id || order.Id
    if (confirm('Видалити замовлення?')) {
      dispatch(deleteOrder(orderId))
    }
  }, [dispatch])

  if (loading) {
    return <div className="p-8 text-center text-xl">⏳ Завантаження...</div>
  }

  // 🔥 DEBUG INFO (виконається ПІСЛЯ рендеру)
  console.log('🔥 DEBUG Orders:', {
    count: orders.length,
    firstOrder: orders[0],
    instrumentsCount: instruments.length
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">📋 Замовлення ({orders.length})</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          ➕ Нове замовлення
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-2xl mb-4">📭 Немає замовлень</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            ➕ Створити перше
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, orderIndex) => {
            // Правильний парсинг ID
            const orderId = order.id?.value || order.id || order.Id || `order-${orderIndex}`
            const instrumentId = order.instrumentId?.value || order.InstrumentId?.value || order.instrumentId
            
            // Знаходимо інструмент
            const instrument = instruments.find(i => 
              (i.id?.value || i.id || i.Id) === instrumentId
            ) || order.instrument || { model: `Інструмент ${orderIndex + 1}` }
            
            // Показуємо notes як номер (бо OrderServices не завантажуються)
            const orderNumber = order.notes || order.Notes || `№${orderIndex + 1}`
            
            return (
              <div key={`order-${orderId}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">
                      🎸 {instrument.model || instrument.Model || 'Інструмент'}
                    </h3>
                    {(instrument.serialNumber || instrument.SerialNumber) && (
                      <div className="text-sm text-gray-600">
                        #{instrument.serialNumber || instrument.SerialNumber}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-all"
                      title="Редагувати"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-all"
                      title="Видалити"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-600">📅 Дата:</span>
                    <span className="font-medium text-sm">
                      {new Date(order.orderDate || order.OrderDate).toLocaleDateString('uk-UA')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-600">🏷️ Статус:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'New' || order.Status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'InProgress' || order.Status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Completed' || order.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || order.Status || 'Нове'}
                    </span>
                  </div>

                  {/* 📝 НОМЕР ЗАМОВЛЕННЯ з notes */}
                  <div className="flex justify-between items-center py-1 bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">📋 Номер:</span>
                    <span className="font-bold text-lg text-gray-900">{orderNumber}</span>
                  </div>

                  <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100 text-right">
                    ID: {String(orderId).slice(-8)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ФОРМА */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingOrder ? '✏️ Редагувати замовлення' : '➕ Нове замовлення'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🎸 Інструмент *</label>
                <select
                  value={formData.instrumentId}
                  onChange={(e) => setFormData({...formData, instrumentId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Виберіть інструмент</option>
                  {instruments.map((instrument, instIndex) => (
                    <option 
                      key={`inst-${instIndex}`} 
                      value={instrument.id?.value || instrument.id || instrument.Id}
                    >
                      {instrument.model || instrument.Model} #{instrument.serialNumber || instrument.SerialNumber || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Дата *</label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Статус *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="New">🆕 Нове</option>
                  <option value="InProgress">⚙️ В роботі</option>
                  <option value="Completed">✅ Завершено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🛠️ Послуги</label>
                <div className="max-h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50 space-y-2">
                  {services.map((service, serviceIndex) => {
                    const serviceId = service.id?.value || service.id || service.Id
                    const isSelected = selectedServicesIds.includes(serviceId)
                    return (
                      <label key={`service-${serviceId || serviceIndex}`} className="flex items-center p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            setSelectedServicesIds(prev => 
                              e.target.checked 
                                ? [...prev.filter(id => id !== serviceId), serviceId]
                                : prev.filter(id => id !== serviceId)
                            )
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-3"
                        />
                        <span className="text-sm">
                          {service.title || service.Title} 
                          <span className="font-bold text-emerald-600 ml-2">
                            {service.price || service.Price} грн
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Обрано: <span className="font-bold text-blue-600">{selectedServicesIds.length}</span> послуг
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📝 Примітки</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-vertical"
                  placeholder="Додаткові примітки до замовлення..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition-all"
                >
                  {editingOrder ? '💾 Оновити' : '➕ Створити'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 font-medium transition-all"
                >
                  ❌ Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
