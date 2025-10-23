import { useState, useEffect } from 'react'
import styles from '../../styles/usuario.module.css'

export default function UsuarioForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [rol, setRol] = useState(initial.rol || 'cajero')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setRol(initial.rol || 'cajero')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ nombre, rol })
  }

  return (
    <form onSubmit={submit} className={styles.formulario}>
  <div>
    <label className={styles.label}>Nombre</label>
    <input
      className={styles.input}
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      required
    />
  </div>
  <div>
    <label className={styles.label}>Rol</label>
    <select
      className={styles.select}
      value={rol}
      onChange={(e) => setRol(e.target.value)}
    >
      <option value="cajero">Cajero</option>
      <option value="administrador">Administrador</option>
    </select>
  </div>
  <div className={styles.botones}>
    <button type="submit" className={styles.boton}>Guardar</button>
    <button type="button" onClick={onCancel} className={styles.cancelar}>Cancelar</button>
  </div>
</form>
  )
}
