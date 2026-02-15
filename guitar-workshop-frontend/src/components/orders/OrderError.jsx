const OrderError = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
    <div className="text-6xl mb-4 text-red-400">⚠️</div>
    <h3 className="text-2xl font-bold text-red-800 mb-4">Помилка завантаження</h3>
    <p className="text-red-700 mb-8 max-w-md mx-auto">{message}</p>
    <button 
      onClick={onRetry}
      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
    >
      Спробувати ще раз
    </button>
  </div>
)

export default OrderError
