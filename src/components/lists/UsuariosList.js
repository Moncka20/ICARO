import React from 'react'

export default function UsuariosList({ usuarios = [], onDelete = () => {}, onEdit = () => {} }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Usuarios</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.nombre}</td>
              <td className="border px-4 py-2">{u.rol}</td>
              <td className="border px-4 py-2">
                <button className="mr-2 text-blue-600" onClick={() => onEdit(u)}>Editar</button>
                <button className="text-red-600" onClick={() => onDelete(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
