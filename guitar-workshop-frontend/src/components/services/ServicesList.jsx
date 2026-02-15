import ServiceCard from './ServiceCard'

export default function ServicesList({ services, loading, onEdit, onDelete }) {
  if (loading) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id || index}
          service={service}
          onEdit={() => onEdit(service)}
          onDelete={() => onDelete(service)}
        />
      ))}
    </div>
  )
}
