import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../api/authService'

export default function Register() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password
      })
      alert('✅ Реєстрація успішна. Тепер увійдіть у систему.')
      navigate('/login')
    } catch (error) {
      console.error(error)
      alert('❌ Не вдалося зареєструватися')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border-4 border-black p-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Реєстрація</h1>
          <p className="text-sm font-medium text-black">Створення облікового запису</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-black uppercase text-black mb-2">
              Ім'я
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-black uppercase text-black mb-2">
              Прізвище
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-black uppercase text-black mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-black uppercase text-black mb-2">
              Телефон
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black uppercase text-black mb-2">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-white hover:text-black transition-all rounded-none disabled:opacity-60"
          >
            {isSubmitting ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-black mt-6">
          Вже маєте акаунт?{' '}
          <Link to="/login" className="font-black underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  )
}
