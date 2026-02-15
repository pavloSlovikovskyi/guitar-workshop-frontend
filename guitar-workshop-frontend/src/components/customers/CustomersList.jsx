import CustomerCard from './CustomerCard'

export default function CustomersList({ customers, loading, onEdit, onDelete }) {
  if (loading) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer, index) => (
        <CustomerCard
          key={`${customer.id?.value || customer.id || index}-${index}`}
          customer={customer}
          onEdit={() => onEdit(customer)}
          onDelete={() => onDelete(customer)}
        />
      ))}
    </div>
  )
}
