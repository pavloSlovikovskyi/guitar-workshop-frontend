export default function InstrumentsHeader({ count, onAdd, loading }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between text-left">
      <div className="flex flex-nowrap items-baseline whitespace-nowrap gap-4 border-b-8 border-black pb-4 mb-12 uppercase w-full">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          Інструменти
        </h1>
        <span className="text-xl md:text-2xl font-light opacity-50">({count})</span>
      </div>
      <button 
        onClick={onAdd}
        className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
        disabled={loading}
      >
        Додати інструмент
      </button>
    </div>
  )
}
