const OrderHeader = ({ ordersCount, onAddClick, loading }) => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between text-left">
    <div className="flex items-baseline gap-4 whitespace-nowrap border-b-8 border-black pb-4 mb-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
        Замовлення
      </h1>
      <span className="text-2xl font-light opacity-50">({ordersCount})</span>
    </div>
    <button 
      onClick={onAddClick}
      className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
      disabled={loading}
    >
      Додати замовлення
    </button>
  </div>
)

export default OrderHeader
