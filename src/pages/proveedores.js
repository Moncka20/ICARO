import Layout from "../components/Layout";
import styles from '../styles/layout.module.css';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

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

        {loading ? <p>Cargando...</p> : <ProveedoresList. proveedores={proveedores} onDelete={handleDelete} onEdit={(p) => setEditing(p)} />}
      </div>
    </Layout>
  )
}

