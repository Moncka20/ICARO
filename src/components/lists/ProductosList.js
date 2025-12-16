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
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const precio = typeof p.precio === 'number' ? p.precio : 0
            const stock = typeof p.stock === 'number' ? p.stock : 0
            const proveedor = typeof p.proveedor === 'string' ? p.proveedor : (p.proveedor?.nombre || '-')
            return (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>${precio.toLocaleString()}</td>
                <td>{stock}</td>
                <td>{proveedor}</td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
