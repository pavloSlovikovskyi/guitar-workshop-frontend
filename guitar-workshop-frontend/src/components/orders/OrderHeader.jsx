const OrderHeader = ({ ordersCount, onAddClick, loading }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-4xl font-bold text-gray-900">
      📋 Замовлення ({ordersCount})
    </h1>
    <button 
      onClick={onAddClick}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
      disabled={loading}
    >
      + Додати замовлення
    </button>
  </div>
)

export default OrderHeader
