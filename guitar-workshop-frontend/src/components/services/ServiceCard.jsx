export default function ServiceCard({ service, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(price)
  }

  return (
    <div className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 truncate" title={service.title || service.name}>
            {service.title || service.name}
          </h3>
          {service.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={service.description}>
              {service.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
          <button onClick={() => onEdit(service)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" title="Редагувати">
            ✏️
          </button>
          <button onClick={() => onDelete(service)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title="Видалити">
            🗑️
          </button>
        </div>
      </div>
      
      {/* ✅ ЦІНА В ЦЕНТРІ */}
      <div className="flex justify-center mb-4">
        <div className="text-2xl font-bold text-emerald-600 bg-emerald-50 px-6 py-3 rounded-xl shadow-sm">
          {formatPrice(service.price)}
        </div>
      </div>
    </div>
  )
}
