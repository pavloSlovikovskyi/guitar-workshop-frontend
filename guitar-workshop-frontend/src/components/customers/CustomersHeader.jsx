export default function CustomersHeader({ count, onAdd, loading }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold text-gray-900">
        👥 Клієнти ({count})
      </h1>
      <button 
        onClick={onAdd}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:bg-emerald-400"
        disabled={loading}
      >
        + Додати клієнта
      </button>
    </div>
  )
}
