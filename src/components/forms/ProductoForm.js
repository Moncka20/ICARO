import { useState, useEffect } from 'react'

export default function ProductoForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [precio, setPrecio] = useState(initial.precio || '')
  const [stock, setStock] = useState(initial.stock || '')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setPrecio(initial.precio || '')
    setStock(initial.stock || '')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, precio: Number(precio), stock: Number(stock) })
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="border p-1 w-full" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Precio</label>
        <input type="number" step="0.01" className="border p-1 w-full" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Stock</label>
        <input type="number" className="border p-1 w-full" value={stock} onChange={(e) => setStock(e.target.value)} required />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
        <button type="button" onClick={onCancel} className="bg-gray-200 px-3 py-1 rounded">Cancelar</button>
      </div>
    </form>
  )
}
