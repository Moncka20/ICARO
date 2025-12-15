import { useEffect, useState } from 'react'
import Layout from "../components/Layout"
import styles from '../styles/layout.module.css'
import style from '../styles/dashboard.module.css'

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
    <div className={style.dashboardContainer}>
      
      {/* Sección de productos */}
      <section className={style.productSection}>
        <div className={style.searchBar}>
          <input
            placeholder="Buscar por nombre..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={style.searchInput}
          />
          <div className={style.qtyBox}>
            <label className={style.qtyLabel}>Cantidad</label>
            <input
              type="number"
              min="1"
              value={selectedQty}
              onChange={e => setSelectedQty(Math.max(1, Number(e.target.value) || 1))}
              className={style.qtyInput}
            />
          </div>
        </div>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {filtered.map(prod => (
          <div key={prod.id} className={style.productCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className={style.productInfo}>
                  {getField(prod, ['nombre','name','title']) || 'Sin nombre'}
                </div>
                <div className={style.productDesc}>
                  {getField(prod, ['descripcion','desc']) || ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className={style.productPrice}>${priceOf(prod).toFixed(2)}</div>
                <input
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={e => setSelectedQty(Math.max(1, Number(e.target.value) || 1))}
                  className={style.qtyInput}
                />
                <button className={style.agregar} onClick={() => addToCart(prod, selectedQty)}>Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Carrito */}
      <aside className={style.cartSection}>
        <div className={style.cartCard}>
          <h5>Carrito</h5>

          <ul className={style.cartList}>
            {cart.length === 0 && (
              <li className={style.cartItemEmpty}>El carrito está vacío</li>
            )}

            {cart.map(item => (
              <li key={item.product.id} className={style.cartItem}>
                <div className={style.cartItemInfo}>
                  <div className={style.productInfo}>
                    {getField(item.product, ['nombre','name','title']) || 'Sin nombre'}
                  </div>
                  <div className={style.productDesc}>
                    {getField(item.product, ['proveedor', 'proveedor_nombre', 'marca']) || 'Proveedor desconocido'}
                  </div>
                </div>

                <div className={style.cartControls}>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={e => updateQty(item.product.id, e.target.value)}
                    className={style.qtyInputCarrito}
                  />
                  <div className={style.lineTotal}>
                    ${(priceOf(item.product) * item.qty).toFixed(2)}
                  </div>
                  <button
                    className={style.delete}
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <hr />

          <div className={style.cartTotal}>
            <strong>Total:</strong>
            <div className={style.totalValue}>${total.toFixed(2)}</div>
          </div>

          <div className={style.payRow}>
            <div className={style.payColumn}>
              <label className={style.qtyLabel}>Pagaron</label>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                className={style.qtyInputPago}
              />
            </div>
            <div className={style.changeColumn}>
              <label className={style.qtyLabelVuelto}>Vuelto</label>
              <div className={`${style.changeBox} ${change < 0 ? style.changeNegative : style.changePositive}`}>
                <strong>${change.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className={style.actions}>
            <button
              className={style.buttonEnviar}
              onClick={sendVenta}
              disabled={cart.length === 0 || change < 0}
            >
              Enviar venta (DB)
            </button>
            <button
              className={style.buttonJSON}
              onClick={exportVenta}
              disabled={cart.length === 0}
            >
              Descargar JSON
            </button>
            <button
              className={style.buttonLimpiar}
              onClick={() => { setCart([]); setPaidAmount(''); }}
              disabled={cart.length === 0}
            >
              Limpiar
            </button>
          </div>

          {change < 0 && (
            <p className={style.changeWarning}>El monto pagado es menor al total.</p>
          )}
        </div>
      </aside>
    </div>
  </Layout>
)
}