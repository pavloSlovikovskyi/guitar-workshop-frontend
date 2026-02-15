import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteService, 
  clearError 
} from '../store/slices/servicesSlice'
import ServicesHeader from '../components/services/ServicesHeader'
import ServicesForm from '../components/services/ServicesForm'
import ServicesList from '../components/services/ServicesList'
import ServicesEmpty from '../components/services/ServicesEmpty'
import ServicesError from '../components/services/ServicesError'

export default function Services() {
  const dispatch = useDispatch()
  const { items: services, loading, error } = useSelector(state => state.services)
  
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({ name: '', price: '', description: '' })
    setEditingService(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    const submitData = {
      title: formData.name.trim(),
      price: parseFloat(formData.price) || 0,
      description: formData.description.trim()
    }
    
    try {
      if (editingService) {
        await dispatch(updateService({ id: editingService.id, service: submitData })).unwrap()
      } else {
        await dispatch(createService(submitData)).unwrap()
      }
      await dispatch(fetchServices())
      alert('✅ Збережено!')
      resetForm()
      setShowForm(false)
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }, [dispatch, formData, editingService, resetForm])

  const handleEdit = useCallback((service) => {
    setEditingService(service)
    setFormData({
      name: service.title || service.name || '',
      price: service.price || '',
      description: service.description || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((service) => {
    if (confirm('Видалити послугу?')) {
      dispatch(deleteService(service.id))
    }
  }, [dispatch])

  const formProps = {
    formData, editingService, showForm, setShowForm,
    handleInputChange, handleSubmit, resetForm, loading
  }

  const listProps = {
    services, loading, onEdit: handleEdit, onDelete: handleDelete
  }

  if (loading && services.length === 0) {
    return <div className="flex justify-center items-center min-h-[400px]"><div className="text-xl text-gray-500">Завантажуємо послуги... ⏳</div></div>
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <ServicesHeader count={services.length} onAdd={() => { setShowForm(true); resetForm() }} loading={loading} />
      
      {error && <ServicesError message={error} onClear={() => dispatch(clearError())} />}
      
      <ServicesForm {...formProps} />
      
      {services.length === 0 && !loading ? (
        <ServicesEmpty onAdd={() => { setShowForm(true); resetForm() }} />
      ) : (
        <ServicesList {...listProps} />
      )}
    </div>
  )
}
