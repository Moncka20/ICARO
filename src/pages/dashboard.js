import { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import styles from '../styles/layout.module.css'

function getField(obj, keys) {
  for (const k of keys) if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k]
  return undefined
}

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([]) // {product, qty}
  const [query, setQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedQty, setSelectedQty] = useState(1)
  const [paidAmount, setPaidAmount] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/productos')
        if (!res.ok) throw new Error('Error cargando productos')
        const data = await res.json()
        if (mounted) setProductos(data || [])
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  function addToCart(product, qty = 1) {
    const qn = Math.max(1, Number(qty) || 1)
    setCart(prev => {
      const idx = prev.findIndex(p => p.product && p.product.id === product.id)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qn }
        return copy
      }
      return [...prev, { product, qty: qn }]
    })
    // reset selector qty
    setSelectedQty(1)
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => !(item.product && item.product.id === productId)))
  }

  function updateQty(productId, qty) {
    const q = Math.max(0, Number(qty) || 0)
    setCart(prev => prev.map(item => item.product && item.product.id === productId ? { ...item, qty: q } : item).filter(i => i.qty > 0))
  }

  function priceOf(p) {
    const raw = getField(p, ['precio', 'price', 'costo', 'valor'])
    if (raw == null) return 0
    const n = Number(String(raw).replace(/[^0-9.-]+/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  // for dropdown search we'll use the full list; keep query for filtering options
  const filtered = productos.filter(prod => {
    if (!query) return true
    const q = query.toLowerCase()
    const nombre = String(getField(prod, ['nombre', 'name', 'titulo', 'title', 'descripcion']) || '')
    return nombre.toLowerCase().includes(q)
  })

  const total = cart.reduce((s, item) => s + priceOf(item.product) * item.qty, 0)
  const paid = Number(String(paidAmount || 0).replace(/[^0-9.-]+/g, '')) || 0
  const change = paid - total

  // Download a local JSON copy of the current sale (no server interaction)
  function exportVenta() {
    const venta = {
      createdAt: new Date().toISOString(),
      items: cart.map(i => ({ id: i.product.id, nombre: getField(i.product, ['nombre','name']) || '', qty: i.qty, precio: priceOf(i.product) })),
      total
    }
    const blob = new Blob([JSON.stringify(venta, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `venta-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Send the sale to the server (create in DB)
  async function sendVenta() {
    if (cart.length === 0) return alert('El carrito está vacío')
    const payload = {
      metodo_pago: 'efectivo',
      total,
      created_at: new Date().toISOString(),
      items: cart.map(i => ({ producto_id: i.product.id, qty: i.qty, precio_unitario: priceOf(i.product) }))
    }

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Server ${res.status}: ${txt}`)
      }
      const data = await res.json()
      // success
      console.log('Venta creada:', data)
      setCart([])
      setPaidAmount('')
      // optionally show a small modal or alert with the sale id
      alert(`Venta registrada. ID: ${data.id}`)
    } catch (err) {
      console.error('Error creando venta:', err)
      alert('Error al crear venta: ' + err.message)
    }
  }

  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Punto de Venta</div>
          <div className={styles.subtitle}>Crear ventas rápidamente desde aquí</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, padding: 24 }}>
        <section style={{ flex: 2 }}>
          <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input placeholder="Buscar por nombre..." value={query} onChange={e => setQuery(e.target.value)} className="form-control" />
            <div style={{ width: 110 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Cantidad</label>
              <input className="form-control" type="number" min="1" value={selectedQty} onChange={e => setSelectedQty(Math.max(1, Number(e.target.value) || 1))} />
            </div>
          </div>

          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ marginTop: 12 }}>
            {filtered.length === 0 && !loading && <p>No se encontraron productos.</p>}
            {filtered.map(prod => (
              <div key={prod.id || prod._id || JSON.stringify(prod)} className="card mb-2" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{getField(prod, ['nombre','name','title']) || 'Sin nombre'}</div>
                    <div style={{ color: '#555', fontSize: 13 }}>{getField(prod, ['descripcion','desc']) || ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontWeight: '700' }}>${priceOf(prod).toFixed(2)}</div>
                    <input className="form-control" type="number" min="1" value={selectedQty} onChange={e => setSelectedQty(Math.max(1, Number(e.target.value) || 1))} style={{ width: 80 }} />
                    <button className="btn btn-primary" onClick={() => addToCart(prod, selectedQty)}>Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ flex: 1 }}>
          <div className="card" style={{ padding: 12 }}>
            <h5>Carrito</h5>
            {cart.length === 0 && <p>El carrito está vacío</p>}

            <ul className="list-group mb-2">
              {cart.length === 0 && <li className="list-group-item">El carrito está vacío</li>}
              {cart.map(item => (
                <li key={item.product.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div style={{ fontWeight: 600 }}>{getField(item.product, ['nombre','name'])}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>ID: {item.product.id} — ${priceOf(item.product).toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input className="form-control form-control-sm" type="number" min="1" value={item.qty} onChange={e => updateQty(item.product.id, e.target.value)} style={{ width: 80 }} />
                    <div style={{ width: 100, textAlign: 'right', fontWeight: 700 }}>${(priceOf(item.product) * item.qty).toFixed(2)}</div>
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.product.id)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>

            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>Total:</strong>
              <div style={{ fontSize: 18 }}>${total.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12 }}>Pagaron</label>
                <input className="form-control" type="number" min="0" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
              </div>
              <div style={{ width: 160 }}>
                <label style={{ display: 'block', fontSize: 12 }}>Vuelto</label>
                <div style={{ padding: 8, background: change < 0 ? '#f8d7da' : '#d1e7dd', borderRadius: 4 }}>
                  <strong style={{ color: change < 0 ? '#842029' : '#0f5132' }}>${change.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
              <button className="btn btn-success" onClick={sendVenta} disabled={cart.length===0 || change < 0}>Enviar venta (DB)</button>
              <button className="btn btn-outline-primary" onClick={exportVenta} disabled={cart.length===0}>Descargar JSON</button>
              <button className="btn btn-secondary" onClick={() => { setCart([]); setPaidAmount('') }} disabled={cart.length===0}>Limpiar</button>
            </div>
            {change < 0 && <p style={{ color: '#842029', marginTop: 8 }}>El monto pagado es menor al total.</p>}
          </div>
        </aside>
      </div>
    </Layout>
  )
}
