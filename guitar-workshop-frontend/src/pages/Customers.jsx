import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  clearError 
} from '../store/slices/customersSlice'
import CustomersHeader from '../components/customers/CustomersHeader'
import CustomersForm from '../components/customers/CustomersForm'
import CustomersList from '../components/customers/CustomersList'
import CustomersEmpty from '../components/customers/CustomersEmpty'
import CustomersError from '../components/customers/CustomersError'

export default function Customers() {
  const dispatch = useDispatch()
  const customersState = useSelector(state => state.customers)
  const customers = Array.isArray(customersState.items) ? customersState.items : []
  const loading = customersState.loading
  const error = customersState.error

  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' })
    setEditingCustomer(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    try {
      if (editingCustomer) {
        await dispatch(updateCustomer({ 
          id: editingCustomer.id?.value || editingCustomer.id, 
          customer: formData 
        })).unwrap()
      } else {
        await dispatch(createCustomer(formData)).unwrap()
        resetForm()
      }
      await dispatch(fetchCustomers())
      setShowForm(false)
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }, [dispatch, formData, editingCustomer, resetForm])

  const handleEdit = useCallback((customer) => {
    setEditingCustomer(customer)
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      phoneNumber: customer.phoneNumber || '',
      email: customer.email || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((customer) => {
    const customerId = customer.id?.value || customer.id
    if (confirm(`Видалити ${customer.firstName} ${customer.lastName}?`)) {
      dispatch(deleteCustomer(customerId))
    }
  }, [dispatch])

  const formProps = {
    formData, editingCustomer, showForm, setShowForm,
    handleInputChange, handleSubmit, resetForm, loading
  }

  const listProps = {
    customers, loading, onEdit: handleEdit, onDelete: handleDelete
  }

  if (loading && customers.length === 0) {
    return <div className="flex justify-center items-center min-h-[400px]"><div className="text-xl text-gray-500">Завантажуємо клієнтів... ⏳</div></div>
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <CustomersHeader count={customers.length} onAdd={() => { setShowForm(true); resetForm() }} loading={loading} />
      
      {error && <CustomersError message={error} onClear={() => dispatch(clearError())} />}
      
      <CustomersForm {...formProps} />
      
      {customers.length === 0 && !loading ? (
        <CustomersEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <CustomersList {...listProps} />
      )}
    </div>
  )
}
