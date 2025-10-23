import React from 'react'

export default function ProductosList({ productos = [], onDelete = () => {}, onEdit = () => {} }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Productos</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.nombre}</td>
              <td className="border px-4 py-2">{p.precio}</td>
              <td className="border px-4 py-2">{p.stock}</td>
              <td className="border px-4 py-2">
                <button className="mr-2 text-blue-600" onClick={() => onEdit(p)}>Editar</button>
                <button className="text-red-600" onClick={() => onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
