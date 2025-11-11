import { useState, useEffect } from 'react'
import styles from '../../styles/usuario.module.css'

export default function UsuarioForm({ initial = {}, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial.nombre || '')
  const [email, setEmail] = useState(initial.email || '')
  const [rol, setRol] = useState(initial.rol || 'cajero')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setNombre(initial.nombre || '')
    setEmail(initial.email || '')
    setRol(initial.rol || 'cajero')
    setPassword('')
  }, [initial])

  const submit = (e) => {
    e.preventDefault()
    // Include email/password only when provided (password blank means no change)
    const payload = { nombre, rol }
    if (email) payload.email = email
    if (password) payload.password = password
    onSubmit(payload)
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
    <label className={styles.label}>Email</label>
    <input
      className={styles.input}
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="usuario@ejemplo.com"
      // required when creating a new user; editing can leave empty
      // leave it optional here and let server validate
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
  <div>
    <label className={styles.label}>Contraseña</label>
    <input
      className={styles.input}
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Dejar en blanco si no cambia"
    />
  </div>
  <div className={styles.botones}>
    <button type="submit" className={styles.boton}>Guardar</button>
    <button type="button" onClick={onCancel} className={styles.cancelar}>Cancelar</button>
  </div>
</form>
  )
}
