import { useState, useEffect } from 'react'
import styles from '../../styles/proveedor.module.css';

export default function ProveedorForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [contacto, setContacto] = useState(initial.contacto || '')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setContacto(initial.contacto || '')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, contacto })
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
    value={contacto}
    onChange={(e) => setContacto(e.target.value)}
    className={styles.input}
  />
  <button type="submit" className={styles.boton}>Guardar</button>
  <button type="button" className={styles.cancelar} onClick={onCancel}>Cancelar</button>
</form>
  )
}
