import { useState, useEffect } from 'react'

export default function UsuarioForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [rol, setRol] = useState(initial.rol || 'cajero')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setRol(initial.rol || 'cajero')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, rol })
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="border p-1 w-full" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Rol</label>
        <select className="border p-1 w-full" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="cajero">Cajero</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
        <button type="button" onClick={onCancel} className="bg-gray-200 px-3 py-1 rounded">Cancelar</button>
      </div>
    </form>
  )
}
