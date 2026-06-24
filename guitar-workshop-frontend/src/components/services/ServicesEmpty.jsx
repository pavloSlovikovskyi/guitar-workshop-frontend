export default function ServicesEmpty({ onAdd }) {
  return (
    <div className="text-center py-20 bg-white p-12 border-2 border-black">
      <div className="text-6xl mb-4">■</div>
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Послуг немає</h3>
      <p className="text-sm font-medium leading-tight text-black mb-8">Додайте першу послугу для ремонту інструментів</p>
      <button onClick={onAdd} className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none">
        Додати першу
      </button>
    </div>
  )
}
