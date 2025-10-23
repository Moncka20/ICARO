import { useEffect, useState } from 'react'
import ProductosList from '../components/lists/ProductosList'
import ProductoForm from '../components/forms/ProductoForm'
import * as productosClient from '../lib/apiClients/productosClient'
import Layout from '../components/Layout'
import styles from '../styles/layout.module.css';

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const data = await productosClient.listProductos()
      setProductos(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleCreate = async (payload) => {
    try {
      await productosClient.createProducto(payload)
      await fetchProductos()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      await productosClient.updateProducto(id, payload)
      await fetchProductos()
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    try {
      await productosClient.deleteProducto(id)
      await fetchProductos()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Inventario</div>
          <div className={styles.subtitle}>
            Desde aquí podrás gestionar tus productos.
          </div>
        </div>
      </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Crear / Editar</h3>
          <ProductoForm
            initial={editing || {}}
            onSubmit={(data) => {
              if (editing) handleUpdate(editing.id, data)
              else handleCreate(data)
            }}
            onCancel={() => setEditing(null)}
          />
        </div>

        {loading ? <p>Cargando...</p> : <ProductosList productos={productos} onDelete={handleDelete} onEdit={(p) => setEditing(p)} />}
    </Layout>
  )
}
