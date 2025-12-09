import { useState, useEffect } from 'react'
import styles from '../../styles/producto.module.css'

export default function ProductoForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [precio, setPrecio] = useState(initial.precio || '')
  const [stock, setStock] = useState(initial.stock || '')
  const [proveedorId, setProveedorId] = useState(initial.proveedor_id || '')
  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    setNombre(initial.nombre || '')
    setPrecio(initial.precio || '')
    setStock(initial.stock || '')
    setProveedorId(initial.proveedor_id || '')
  }, [initial])

  useEffect(() => {
    // Fetch proveedores list
    async function fetchProveedores() {
      try {
        const res = await fetch('/api/proveedores')
        if (res.ok) {
          const data = await res.json()
          setProveedores(data)
        }
      } catch (err) {
        console.error('Error fetching proveedores:', err)
      }
    }
    fetchProveedores()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ 
      nombre, 
      precio: Number(precio), 
      stock: Number(stock),
      proveedor_id: proveedorId || null
    })
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
      <select
        className={styles.inputField}
        value={proveedorId}
        onChange={(e) => setProveedorId(e.target.value)}
      >
        <option value="">-- Seleccionar Proveedor (opcional) --</option>
        {proveedores.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
      <div className={styles.buttonRow}>
        <button type="submit" className={styles.buttonPrimary}>Guardar</button>
        <button type="button" onClick={onCancel} className={styles.buttonSecondary}>Cancelar</button>
      </div>
    </form>
  )
}
