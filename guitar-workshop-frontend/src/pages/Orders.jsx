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
import { downloadOrdersReport } from '../api/reportService'
import axiosInstance from '../api/axiosInstance'

export default function Orders() {
  const dispatch = useDispatch()
  const userRole = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')
  const { items: orders = [], loading } = useSelector(s => s.orders)
  const { items: instruments = [] } = useSelector(s => s.instruments)
  const { items: services = [] } = useSelector(s => s.services)
  const roleRaw = useSelector(s => s.auth.role) || userRole
  const role = roleRaw ? roleRaw.toLowerCase() : null
  const isMaster = role === 'master'
  const isCustomer = role === 'customer' || role === 'client'

  const [showForm, setShowForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('Excel')
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

  const getInstrumentModel = (order) => {
    const nameFromOrder = order.instrumentName?.trim()
    if (nameFromOrder) {
      return nameFromOrder
    }

    return (
      order.instrumentModel ||
      order.instrument?.model ||
      instruments.find(i => i.id === order.instrumentId)?.model ||
      'Інструмент не вказано'
    )
  }

  const statusStyles = {
    New: 'bg-black text-white',
    Open: 'bg-black text-white',
    InProgress: 'bg-black text-white',
    Completed: 'bg-black text-white',
    Cancelled: 'bg-black text-white'
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
          await axiosInstance.delete(`/orders/${orderId}/services/${serviceId}`)
        }

        for (const serviceId of toAdd) {
          await axiosInstance.post(`/orders/${orderId}/services`, { serviceId })
        }
      } else {
        const res = await dispatch(createOrder(request)).unwrap()
        orderId = res.id

        for (const serviceId of selectedServicesIds) {
          await axiosInstance.post(`/orders/${orderId}/services`, { serviceId })
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

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    try {
      const extensions = { Excel: 'xlsx', Pdf: 'pdf', Word: 'docx' }
      const response = await downloadOrdersReport(selectedFormat)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Orders_Report.${extensions[selectedFormat]}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      alert('✅ Звіт успішно завантажено')
    } catch (error) {
      console.error(error)
      alert('❌ Не вдалося завантажити звіт')
    } finally {
      setIsDownloading(false)
    }
  }

  if (token && !role) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-black">Loading...</div>
      </div>
    )
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-black">Завантажуємо замовлення...</div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-10 text-left">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {isMaster ? (
          <OrderHeader 
            ordersCount={orders.length}
            onAddClick={() => { resetForm(); setShowForm(true) }}
            loading={loading}
          />
        ) : (
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter border-b-8 border-black pb-4 mb-12">Мої замовлення</h1>
            <p className="text-sm font-medium leading-tight text-black">Перегляньте статуси та деталі ремонту</p>
          </div>
        )}
        {isMaster && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              disabled={isDownloading}
            >
              <option value="Excel">Excel</option>
              <option value="Pdf">PDF</option>
            </select>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Завантаження...</span>
                </>
              ) : (
                'Згенерувати звіт'
              )}
            </button>
          </div>
        )}
      </div>
      
      {isMaster && showForm && (
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
        isMaster ? (
          <OrderEmpty onAddClick={() => { resetForm(); setShowForm(true) }} />
        ) : (
          <div className="border-2 border-black bg-white p-10 text-center text-black">
            <div className="text-6xl mb-4">■</div>
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Активних замовлень немає</h3>
            <p className="text-sm font-medium leading-tight text-black">
              У вас поки немає активних замовлень на ремонт
            </p>
          </div>
        )
      ) : (
        isMaster ? (
          <OrderList
            orders={orders}
            instruments={instruments}
            services={services}
            calculateOrderTotal={calculateOrderTotal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 text-left">
            {orders.map((order) => {
              const statusClass = statusStyles[order.status] || 'bg-black text-white'
              return (
                <div key={order.id} className="border-2 border-black p-8 bg-white flex flex-col h-full min-h-[300px] justify-between rounded-none shadow-none">
                  <div className="flex-grow">
                    <p className="text-xs font-bold uppercase text-black">Інструмент</p>
                    <h3 className="text-2xl font-black uppercase mb-2 break-words whitespace-normal overflow-wrap-anywhere">
                      {getInstrumentModel(order)}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold uppercase inline-block ${statusClass}`}>
                      {order.status || 'Невідомо'}
                    </span>
                    <div className="mt-4 text-sm font-medium leading-tight text-black">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('uk-UA') : '—'}
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-black text-black">
                      {calculateOrderTotal(order.services).toLocaleString('uk-UA')} грн
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
