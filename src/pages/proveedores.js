import { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import styles from '../styles/layout.module.css'
import ProveedoresList from '../components/lists/ProveedoresList'
import ProveedorForm from '../components/forms/ProveedorForm'
import * as proveedoresClient from '../lib/apiClients/proveedoresClient'
import proveedorStyles from '../styles/proveedor.module.css';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const fetchProveedores = async () => {
    setLoading(true)
    try {
      const data = await proveedoresClient.listProveedores()
      setProveedores(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  const handleCreate = async (payload) => {
    try {
      await proveedoresClient.createProveedor(payload)
      await fetchProveedores()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      await proveedoresClient.updateProveedor(id, payload)
      await fetchProveedores()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar proveedor?')) return
    try {
      await proveedoresClient.deleteProveedor(id)
      await fetchProveedores()
    } catch (err) {
      alert(err.message)
    }
  }

  // Filtrado de proveedores por nombre
  const filtered = proveedores.filter((prov) => {
    if (!query) return true
    const nombre = String(prov?.nombre || prov?.name || '')
    return nombre.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Proveedores</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus proveedores.
          </div>
        </div>
      </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Crear / Editar</h3>
          <ProveedorForm
            initial={editing || {}}
            onSubmit={(data) => {
              if (editing) handleUpdate(editing.id, data)
              else handleCreate(data)
            }}
            onCancel={() => setEditing(null)}
          />
        </div>

        {/* Buscador debajo del formulario */}
        <div style={{ marginBottom: '24px' }}>
          <input
            placeholder="Buscar proveedor por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginTop: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

  {loading ? (
    <p>Cargando...</p>
  ) : (
    <ProveedoresList
      proveedores={filtered}
      onDelete={handleDelete}
      onEdit={(p) => setEditing(p)}
    />
  )}
    </Layout>
  )
}

