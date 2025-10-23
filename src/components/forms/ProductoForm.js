import { useState, useEffect } from 'react'
import styles from '../../styles/producto.module.css'

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
    <form onSubmit={submit} className={styles.formGroup}>
      <input
        className={styles.inputField}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="number"
        step="0.01"
        className={styles.inputField}
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
        required
      />
      <input
        type="number"
        className={styles.inputField}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        required
      />
      <div className={styles.buttonRow}>
        <button type="submit" className={styles.buttonPrimary}>Guardar</button>
        <button type="button" onClick={onCancel} className={styles.buttonSecondary}>Cancelar</button>
      </div>
    </form>
  )
}
