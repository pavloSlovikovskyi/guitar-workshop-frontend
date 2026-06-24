export default function ServiceCard({ service, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(price)
  }

  return (
    <div className="border-2 border-black p-8 bg-white flex flex-col h-full min-h-[300px] justify-between rounded-none shadow-none text-left">
      <div className="flex-grow">
        <h3 className="text-2xl font-black uppercase mb-2 break-words whitespace-normal overflow-wrap-anywhere" title={service.title || service.name}>
          {service.title || service.name}
        </h3>
        {service.description && (
          <p className="text-sm font-medium leading-tight text-black break-words whitespace-normal overflow-wrap-anywhere" title={service.description}>
            {service.description}
          </p>
        )}
        <div className="mt-6">
          <div className="text-2xl font-black text-black border-2 border-black px-6 py-3 inline-block">
            {formatPrice(service.price)}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => onEdit(service)}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Редагувати"
        >
          Редагувати
        </button>
        <button
          onClick={() => onDelete(service)}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Видалити"
        >
          Видалити
        </button>
      </div>
    </div>
  )
}
