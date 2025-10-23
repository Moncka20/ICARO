import React from 'react'
import styles from '../../styles/proveedor.module.css'

export default function ProveedoresList({ proveedores = [], onDelete = () => {}, onEdit = () => {} }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Proveedores</h2>
      <table className={styles.tabla}>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Contacto</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {proveedores.map((p) => (
      <tr key={p.id}>
        <td>{p.nombre}</td>
        <td>{p.contacto}</td>
        <td>
          <div className={styles.acciones}>
            <button className={styles.accion} onClick={() => onEdit(p)}>Editar</button>
            <button className={styles.accion} onClick={() => onDelete(p.id)}>Eliminar</button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  )
}
