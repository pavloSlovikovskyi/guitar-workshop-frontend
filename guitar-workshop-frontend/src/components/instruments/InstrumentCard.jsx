export default function InstrumentCard({ instrument, onEdit, onDelete }) {
  return (
    <div className="border-2 border-black p-8 bg-white flex flex-col h-full min-h-[300px] justify-between rounded-none shadow-none text-left">
      <div className="flex-grow">
        <h3 className="text-2xl font-black uppercase mb-2 break-words whitespace-normal overflow-wrap-anywhere" title={instrument.model}>
          {instrument.model}
        </h3>
        <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase inline-block">
          {instrument.status}
        </span>
        <div className="mt-4 space-y-2 text-sm font-medium leading-tight text-black">
          <div className="flex justify-between gap-4">
            <span className="uppercase text-xs font-bold">Серійний №</span>
            <span className="font-mono break-words whitespace-normal overflow-wrap-anywhere text-right">
              {instrument.serialNumber}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="uppercase text-xs font-bold">Дата</span>
            <span className="text-right">
              {instrument.recieveDate ? new Date(instrument.recieveDate).toLocaleDateString('uk-UA') : 'Немає дати'}
            </span>
          </div>
          {instrument.customerId && (
            <div className="flex justify-between gap-4">
              <span className="uppercase text-xs font-bold">Клієнт</span>
              <span className="font-mono break-words whitespace-normal overflow-wrap-anywhere text-right">
                {instrument.customerId}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onEdit}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Редагувати"
        >
          Редагувати
        </button>
        <button
          onClick={onDelete}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Видалити"
        >
          Видалити
        </button>
      </div>
    </div>
  )
}
