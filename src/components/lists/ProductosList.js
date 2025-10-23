import React from 'react'
import styles from '../../styles/producto.module.css'

export default function ProductosList({ productos = [], onDelete = () => {}, onEdit = () => {} }) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Productos</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio.toLocaleString()}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(p)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
