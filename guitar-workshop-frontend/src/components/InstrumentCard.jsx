import { statusColors } from '../utils/statusColors'

export default function InstrumentCard({ instrument }) {
  const statusColor = statusColors[instrument.status] || 'gray'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 truncate max-w-[200px]">
          {instrument.model}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
          {instrument.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p><span className="font-medium">Серійний №:</span> {instrument.serialNumber}</p>
        <p><span className="font-medium">Дата прийому:</span> {new Date(instrument.recieveDate).toLocaleDateString('uk-UA')}</p>
        {instrument.customerId && (
          <p><span className="font-medium">Клієнт ID:</span> {instrument.customerId}</p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">ID: {instrument.id}</span>
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Редагувати</button>
          <button className="text-red-600 hover:text-red-800 text-sm font-medium">Видалити</button>
        </div>
      </div>
    </div>
  )
}
