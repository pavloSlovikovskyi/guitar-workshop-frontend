export default function InstrumentsError({ message, onClear }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <strong>Помилка:</strong> {message}
      </div>
      <button 
        onClick={onClear} 
        className="text-red-700 hover:text-red-900 font-bold text-xl p-1 hover:bg-red-100 rounded"
      >
        ×
      </button>
    </div>
  )
}
