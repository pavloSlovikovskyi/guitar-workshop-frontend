const OrderError = ({ message, onRetry }) => (
  <div className="bg-white border-2 border-black p-12 text-center">
    <div className="text-6xl mb-4">!</div>
    <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Помилка завантаження</h3>
    <p className="text-sm font-medium leading-tight text-black mb-8 max-w-md mx-auto">{message}</p>
    <button 
      onClick={onRetry}
      className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
    >
      Спробувати ще раз
    </button>
  </div>
)

export default OrderError
