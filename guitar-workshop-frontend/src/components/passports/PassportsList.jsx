import PassportCard from './PassportCard'

export default function PassportsList({ passportsWithInstruments, loading, onEdit, onDelete }) {
  if (loading) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {passportsWithInstruments.map((passport) => (
        <PassportCard
          key={passport.id}
          passport={passport}
          onEdit={() => onEdit(passport)}
          onDelete={() => onDelete(passport)}
        />
      ))}
    </div>
  )
}
