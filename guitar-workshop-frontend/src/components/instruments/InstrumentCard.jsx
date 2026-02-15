import { statusColors } from '../../utils/statusColors'

export default function InstrumentCard({ instrument, onEdit, onDelete }) {
  const statusColor = statusColors[instrument.status] || statusColors.default

  return (
    <div className="group bg-white p-6 rounded-xl shadow border hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 truncate" title={instrument.model}>
            {instrument.model}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor}`}>
            {instrument.status}
          </span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
          <button onClick={onEdit} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" title="Редагувати">
            ✏️
          </button>
          <button onClick={onDelete} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title="Видалити">
            🗑️
          </button>
        </div>
      </div>
      <div className="text-sm space-y-1 text-gray-600 divide-y divide-gray-100">
        <div className="py-1 flex justify-between">
          <span>Серійний №:</span>
          <span className="font-mono">{instrument.serialNumber}</span>
        </div>
        <div className="py-1">
          <span>Дата: </span>
          <span>{instrument.recieveDate ? new Date(instrument.recieveDate).toLocaleDateString('uk-UA') : 'Немає дати'}</span>
        </div>
        {instrument.customerId && (
          <div className="py-1">
            <span>Клієнт: </span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{instrument.customerId}</span>
          </div>
        )}
      </div>
    </div>
  )
}
