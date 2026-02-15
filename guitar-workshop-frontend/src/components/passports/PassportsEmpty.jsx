export default function PassportsEmpty({ onAdd }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl p-12 border-2 border-dashed border-gray-200">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-2xl font-bold text-gray-500 mb-4">Техпаспортів немає</h3>
      <p className="text-gray-500 mb-8">Додайте перший паспорт для інструменту</p>
      <button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
        Додати перший
      </button>
    </div>
  )
}
