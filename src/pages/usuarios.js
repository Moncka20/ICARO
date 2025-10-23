import { useEffect, useState } from 'react'
import UsuariosList from '../components/lists/UsuariosList'
import UsuarioForm from '../components/forms/UsuarioForm'
import * as usuariosClient from '../lib/apiClients/usuariosClient'
import Layout from '../components/Layout'
import styles from '../styles/layout.module.css'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const data = await usuariosClient.listUsuarios()
      setUsuarios(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleCreate = async (payload) => {
    try {
      await usuariosClient.createUsuario(payload)
      await fetchUsuarios()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      await usuariosClient.updateUsuario(id, payload)
      await fetchUsuarios()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return
    try {
      await usuariosClient.deleteUsuario(id)
      await fetchUsuarios()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Usuarios</div>
          <div className={styles.subtitle}>Desde aquí podrás gestionar tus Usuarios.</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <div className="mb-6">
          <h3 className="font-medium mb-2">Crear / Editar</h3>
          <UsuarioForm
            initial={editing || {}}
            onSubmit={(data) => {
              if (editing) handleUpdate(editing.id, data)
              else handleCreate(data)
            }}
            onCancel={() => setEditing(null)}
          />
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <UsuariosList usuarios={usuarios} onDelete={handleDelete} onEdit={(p) => setEditing(p)} />
        )}
      </div>
    </Layout>
  )
}
