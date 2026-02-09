export default function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100" key={customer.id}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-blue-600 font-medium">{customer.email}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(customer)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Редагувати"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(customer.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Видалити"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div><span className="font-medium">Телефон:</span> {customer.phoneNumber}</div>
        <div><span className="font-medium">ID:</span> {customer.id}</div>
        {customer.createdAt && (
          <div><span className="font-medium">Створено:</span> {new Date(customer.createdAt).toLocaleDateString('uk-UA')}</div>
        )}
      </div>
    </div>
  )
}
