import { useState, useEffect } from 'react'
import styles from '../../styles/proveedor.module.css';

export default function ProveedorForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [telefono, setTelefono] = useState(initial.telefono || '')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setTelefono(initial.telefono || '')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, telefono })
  }

  return (
    <form onSubmit={submit} className={styles.formulario}>

  <input
    type="text"
    placeholder="Nombre del proveedor"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
    className={styles.input}
  />
  <input
    type="text"
    placeholder="Contacto"
    value={telefono}
    onChange={(e) => setTelefono(e.target.value)}
    className={styles.input}
  />
  <button type="submit" className={styles.boton}>Guardar</button>
  <button type="button" className={styles.cancelar} onClick={onCancel}>Cancelar</button>
</form>
  )
}
