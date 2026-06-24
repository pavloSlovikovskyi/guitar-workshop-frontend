export default function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="border-2 border-black p-8 bg-white flex flex-col h-full min-h-[300px] justify-between rounded-none shadow-none text-left">
      <div className="flex-grow">
        <h3 className="text-2xl font-black uppercase mb-2 break-words whitespace-normal overflow-wrap-anywhere" title={`${customer.firstName} ${customer.lastName}`}>
          {customer.firstName} {customer.lastName}
        </h3>
        <p className="text-sm font-medium leading-tight text-black break-words whitespace-normal overflow-wrap-anywhere">
          {customer.email}
        </p>
        <div className="mt-4 space-y-2 text-sm font-medium leading-tight text-black">
          <div className="flex justify-between gap-4">
            <span className="uppercase text-xs font-bold">Телефон</span>
            <span className="text-right break-words whitespace-normal overflow-wrap-anywhere">
              {customer.phoneNumber}
            </span>
          </div>
          {customer.createdAt && (
            <div className="flex justify-between gap-4">
              <span className="uppercase text-xs font-bold">Створено</span>
              <span className="text-right">
                {new Date(customer.createdAt).toLocaleDateString('uk-UA')}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => onEdit(customer)}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Редагувати"
        >
          Редагувати
        </button>
        <button
          onClick={() => onDelete(customer)}
          className="w-full bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all rounded-none"
          title="Видалити"
        >
          Видалити
        </button>
      </div>
    </div>
  )
}
