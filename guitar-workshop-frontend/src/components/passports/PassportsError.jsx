export default function PassportsError({ message, onClear }) {
  return (
    <div className="bg-white border-2 border-black p-6 flex flex-col gap-4 text-black">
      <div className="text-5xl">!</div>
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Помилка</h3>
      <p className="text-sm font-medium leading-tight text-black">{message}</p>
      <button onClick={onClear} className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
        Закрити
      </button>
    </div>
  )
}
