import { useState, useEffect } from 'react'

export default function ProveedorForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [contacto, setContacto] = useState(initial.contacto || '')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setContacto(initial.contacto || '')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, contacto })
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="border p-1 w-full" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Contacto</label>
        <input className="border p-1 w-full" value={contacto} onChange={(e) => setContacto(e.target.value)} />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
        <button type="button" onClick={onCancel} className="bg-gray-200 px-3 py-1 rounded">Cancelar</button>
      </div>
    </form>
  )
}
