export default function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 truncate" title={`${customer.firstName} ${customer.lastName}`}>
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-blue-600 font-semibold text-sm mt-1 truncate">{customer.email}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
          <button onClick={() => onEdit(customer)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" title="Редагувати">
            ✏️
          </button>
          <button onClick={() => onDelete(customer)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title="Видалити">
            🗑️
          </button>
        </div>
      </div>
      <div className="text-sm space-y-1 text-gray-600 divide-y divide-gray-100">
        <div className="py-1 flex justify-between">
          <span>Телефон:</span>
          <span>{customer.phoneNumber}</span>
        </div>
        {customer.createdAt && (
          <div className="py-1">
            <span>Створено: </span>
            <span>{new Date(customer.createdAt).toLocaleDateString('uk-UA')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
