import InstrumentCard from './InstrumentCard'

export default function InstrumentsList({ instruments, loading, onEdit, onDelete }) {
  if (loading) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {instruments.map((instrument) => (
        <InstrumentCard
          key={instrument.id}
          instrument={instrument}
          onEdit={() => onEdit(instrument)}
          onDelete={() => onDelete(instrument.id)}
        />
      ))}
    </div>
  )
}
