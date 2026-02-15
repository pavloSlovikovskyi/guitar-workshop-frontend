import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder
} from '../store/slices/ordersSlice'
import { fetchInstruments } from '../store/slices/instrumentsSlice'
import { fetchServices } from '../store/slices/servicesSlice'
import OrderHeader from '../components/orders/OrderHeader'
import OrderForm from '../components/orders/OrderForm'
import OrderList from '../components/orders/OrderList'
import OrderEmpty from '../components/orders/OrderEmpty'

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

  const totalPrice = ((selectedServicesIds) => {
    return selectedServicesIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  })(selectedServicesIds)

  const calculateOrderTotal = (orderServices) => {
    return (orderServices ?? []).reduce((total, service) => {
      const fullService = services.find(s => s.id === service.id)
      return total + (fullService?.price || service.price || 0)
    }, 0)
  }

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchInstruments())
    dispatch(fetchServices())
  }, [dispatch])

  const resetForm = useCallback(() => {
    setEditingOrder(null)
    setSelectedServicesIds([])
    setFormData({
      instrumentId: '',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'New',
      notes: ''
    })
  }, [])

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
        await dispatch(updateOrder({ id: editingOrder.id, request })).unwrap()
        orderId = editingOrder.id

        const existingServices = (editingOrder.services ?? []).map(s => s.id)
        const toRemove = existingServices.filter(id => !selectedServicesIds.includes(id))
        const toAdd = selectedServicesIds.filter(id => !existingServices.includes(id))

        for (const serviceId of toRemove) {
          await fetch(`/api/orders/${orderId}/services/${serviceId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          })
        }

        for (const serviceId of toAdd) {
          await fetch(`/api/orders/${orderId}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId })
          })
        }
      } else {
        const res = await dispatch(createOrder(request)).unwrap()
        orderId = res.id

        for (const serviceId of selectedServicesIds) {
          await fetch(`/api/orders/${orderId}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId })
          })
        }
      }

      await dispatch(fetchOrders())
      alert(`✅ Збережено! Вартість: ${totalPrice.toLocaleString('uk-UA')} грн`)
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <OrderHeader 
        ordersCount={orders.length}
        onAddClick={() => { resetForm(); setShowForm(true) }}
        loading={loading}
      />
      
      {showForm && (
        <OrderForm
          formData={formData}
          setFormData={setFormData}
          selectedServicesIds={selectedServicesIds}
          setSelectedServicesIds={setSelectedServicesIds}
          services={services}
          instruments={instruments}
          totalPrice={totalPrice}
          editingOrder={editingOrder}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); resetForm() }}
        />
      )}

      {orders.length === 0 && !loading ? (
        <OrderEmpty onAddClick={() => { resetForm(); setShowForm(true) }} />
      ) : (
        <OrderList
          orders={orders}
          instruments={instruments}
          services={services}
          calculateOrderTotal={calculateOrderTotal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  )
}
