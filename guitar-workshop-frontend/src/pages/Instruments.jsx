import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchInstruments, 
  createInstrument, 
  updateInstrument, 
  deleteInstrument, 
  clearError 
} from '../store/slices/instrumentsSlice'
import InstrumentsHeader from '../components/instruments/InstrumentsHeader'
import InstrumentsForm from '../components/instruments/InstrumentsForm'
import InstrumentsList from '../components/instruments/InstrumentsList'
import InstrumentsEmpty from '../components/instruments/InstrumentsEmpty'
import InstrumentsError from '../components/instruments/InstrumentsError'

export default function Instruments() {
  const dispatch = useDispatch()
  const { items: instruments, loading, error } = useSelector(state => state.instruments)
  
  // Стейти
  const [editingInstrument, setEditingInstrument] = useState(null)
  const [formData, setFormData] = useState({
    model: '',
    serialNumber: '',
    recieveDate: new Date().toISOString().split('T')[0],
    status: 'InRepair',
    customerId: '',
    customerName: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchInstruments())
  }, [dispatch])

  // Handlers
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      model: '',
      serialNumber: '',
      recieveDate: new Date().toISOString().split('T')[0],
      status: 'InRepair',
      customerId: ''
    })
    setEditingInstrument(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const apiData = {
      Model: formData.model.trim(),
      SerialNumber: formData.serialNumber.trim(),
      Status: formData.status,
      CustomerId: formData.customerId.trim() || null,
      CustomerName: formData.customerName,
      RecieveDate: `${formData.recieveDate}T00:00:00Z`
    }
    
    try {
      if (editingInstrument) {
        await dispatch(updateInstrument({ id: editingInstrument.id, instrument: apiData })).unwrap()
      } else {
        await dispatch(createInstrument(apiData)).unwrap()
      }
      await dispatch(fetchInstruments())
      alert('✅ Збережено!')
      setShowForm(false)
      resetForm()
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }, [dispatch, formData, editingInstrument])

  const handleEdit = useCallback((instrument) => {
    setEditingInstrument(instrument)
    setFormData({
      model: instrument.model || '',
      serialNumber: instrument.serialNumber || '',
      recieveDate: instrument.recieveDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: instrument.status || 'InRepair',
      customerId: instrument.customerId?.toString() || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((id) => {
    if (confirm('Видалити інструмент?')) {
      dispatch(deleteInstrument(id))
    }
  }, [dispatch])

  // Пропси для компонентів
  const formProps = {
    formData,
    editingInstrument,
    showForm,
    setShowForm,
    handleInputChange,
    handleSubmit,
    resetForm,
    loading
  }

  const listProps = {
    instruments,
    loading,
    onEdit: handleEdit,
    onDelete: handleDelete
  }

  if (loading && instruments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">Завантажуємо інструменти... ⏳</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <InstrumentsHeader count={instruments.length} onAdd={() => { setShowForm(true); resetForm() }} loading={loading} />
      
      {error && <InstrumentsError message={error} onClear={() => dispatch(clearError())} />}
      
      <InstrumentsForm {...formProps} />
      
      {instruments.length === 0 && !loading ? (
        <InstrumentsEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <InstrumentsList {...listProps} />
      )}
    </div>
  )
}
