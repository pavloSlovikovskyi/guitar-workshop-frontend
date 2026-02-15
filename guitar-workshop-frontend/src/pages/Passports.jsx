import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchPassports, createPassport, updatePassport, deletePassport, clearError 
} from '../store/slices/passportsSlice'
import { fetchInstruments } from '../store/slices/instrumentsSlice'
import PassportsHeader from '../components/passports/PassportsHeader'
import PassportsForm from '../components/passports/PassportsForm'
import PassportsList from '../components/passports/PassportsList'
import PassportsEmpty from '../components/passports/PassportsEmpty'
import PassportsError from '../components/passports/PassportsError'

export default function Passports() {
  const dispatch = useDispatch()
  const { items: passports, loading, error } = useSelector(state => state.passports)
  const instruments = useSelector(state => state.instruments.items)
  
  const [editingPassport, setEditingPassport] = useState(null)
  const [formData, setFormData] = useState({
    instrumentId: '',
    issueDate: new Date().toISOString().split('T')[0],
    details: ''
  })
  const [showForm, setShowForm] = useState(false)

  const passportsWithInstruments = useMemo(() => {
    if (!Array.isArray(passports)) return []
    if (!Array.isArray(instruments)) return []
    
    return passports
      .filter(passport => passport && passport.id)
      .map(passport => {
        const instrument = instruments.find(i => i && i.id === passport.instrumentId)
        return {
          ...passport,
          instrumentName: instrument?.model || 'Не знайдено',
          instrumentSerial: instrument?.serialNumber || 'N/A',
          customerId: instrument?.customerId || null,
          shortId: passport.id ? passport.id.slice(-4) : 'XXXX'
        }
      })
  }, [passports, instruments])

  useEffect(() => {
    dispatch(fetchPassports())
    dispatch(fetchInstruments())
  }, [dispatch])

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      instrumentId: '',
      issueDate: new Date().toISOString().split('T')[0],
      details: ''
    })
    setEditingPassport(null)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    dispatch(clearError())
    
    const submitData = {
      instrumentId: formData.instrumentId,
      issueDate: `${formData.issueDate}T00:00:00Z`,
      details: formData.details.trim()
    }
    
    try {
      if (editingPassport) {
        await dispatch(updatePassport({ id: editingPassport.id, passportData: submitData })).unwrap()
      } else {
        await dispatch(createPassport({ instrumentId: submitData.instrumentId, passportData: submitData })).unwrap()
        resetForm()
      }
      await dispatch(fetchPassports())
      setShowForm(false)
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }, [dispatch, formData, editingPassport, resetForm])

  const handleEdit = useCallback((passport) => {
    setEditingPassport(passport)
    setFormData({
      instrumentId: passport.instrumentId,
      issueDate: passport.issueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      details: passport.details || ''
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((passport) => {
    if (confirm('Видалити техпаспорт?')) {
      dispatch(deletePassport(passport.id))
    }
  }, [dispatch])

  const formProps = {
    formData, instruments, editingPassport, showForm, setShowForm,
    handleInputChange, handleSubmit, resetForm, loading
  }

  const listProps = {
    passportsWithInstruments, loading, onEdit: handleEdit, onDelete: handleDelete
  }

  if (loading && passportsWithInstruments.length === 0) {
    return <div className="flex justify-center items-center min-h-[400px]"><div className="text-xl text-gray-500">Завантажуємо паспорти... ⏳</div></div>
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <PassportsHeader count={passportsWithInstruments.length} onAdd={() => { setShowForm(true); resetForm() }} loading={loading} />
      
      {error && <PassportsError message={error} onClear={() => dispatch(clearError())} />}
      
      <PassportsForm {...formProps} />
      
      {passportsWithInstruments.length === 0 && !loading ? (
        <PassportsEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <PassportsList {...listProps} />
      )}
    </div>
  )
}
