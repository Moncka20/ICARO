import React from 'react'
import styles from '../../styles/usuario.module.css'

export default function UsuariosList({ usuarios = [], onDelete = () => {}, onEdit = () => {} }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Usuarios</h2>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.rol}</td>
              <td>
                <div className={styles.acciones}>
                  <button className={styles.editar} onClick={() => onEdit(u)}>Editar</button>
                  <button className={styles.delete} onClick={() => onDelete(u.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
