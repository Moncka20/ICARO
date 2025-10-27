import { useEffect, useMemo, useState } from 'react'
import Layout from "../components/Layout"
import styles from '../styles/layout.module.css'

function sum(arr) { return arr.reduce((s, v) => s + (v || 0), 0) }

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/ventas')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (mounted) setVentas(data)
      } catch (err) {
        console.warn('No se pudo obtener /api/ventas:', err.message)
        if (mounted) setVentas([])
        setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const data = ventas
  const stats = useMemo(() => {
    if (!data || data.length === 0) return {
      totalVendido: 0, ventasCount: 0, promedio: 0, ventasPorDia: {}, topProductos: []
    }

    const totalVendido = sum(data.map(v => Number(v.total) || 0))
    const ventasCount = data.length
    const promedio = ventasCount ? totalVendido / ventasCount : 0

    // ventas por día
    const ventasPorDia = {}
    for (const v of data) {
      const d = new Date(v.created_at || v.createdAt).toLocaleDateString()
      ventasPorDia[d] = (ventasPorDia[d] || 0) + (Number(v.total) || 0)
    }

    // top productos
    const productMap = {}
    for (const v of data) {
      for (const it of v.detalle_ventas || []) {
        const key = it.producto_id || it.producto || it.id
        const nombre = it.producto.nombre || key
        productMap[key] = productMap[key] || { nombre, qty: 0, ventas: 0 }
        const qty = Number(it.cantidad || it.qty || 0)
        const precio = Number(it.precio_unitario || it.precio || 0)
        productMap[key].qty += qty
        productMap[key].ventas += precio * qty
      }
    }
    const topProductos = Object.values(productMap).sort((a,b)=>b.ventas - a.ventas)

    return { totalVendido, ventasCount, promedio, ventasPorDia, topProductos }
  }, [data])

  return (
    <Layout>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.title}>Estadísticas de Ventas</div>
          <div className={styles.subtitle}>Resumen rápido de rendimiento de ventas</div>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {loading && <p>Cargando estadísticas...</p>}
        {!loading && error && (
          <div className="alert alert-warning">No se pudo cargar datos reales (/api/ventas). Mostrando ejemplo. Error: {error}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <div className="card p-3">
            <div style={{ fontSize: 12, color: '#666' }}>Total vendido</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${stats.totalVendido.toFixed(2)}</div>
          </div>
          <div className="card p-3">
            <div style={{ fontSize: 12, color: '#666' }}>Número de ventas</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.ventasCount}</div>
          </div>
          <div className="card p-3">
            <div style={{ fontSize: 12, color: '#666' }}>Promedio por venta</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${stats.promedio.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h5>Ventas por día</h5>
            <div className="card p-3">
              {Object.keys(stats.ventasPorDia).length === 0 && <p>No hay datos</p>}
              {Object.entries(stats.ventasPorDia).map(([day, val]) => (
                <div key={day} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{day}</div>
                    <div>${Number(val).toFixed(2)}</div>
                  </div>
                  <div style={{ height: 8, background: '#eee', borderRadius: 4, marginTop: 6 }}>
                    <div style={{ height: '100%', background: '#0d6efd', width: `${Math.min(100, (val / stats.totalVendido) * 100)}%`, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 360 }}>
            <h5>Top productos</h5>
            <div className="card p-3">
              {stats.topProductos.length === 0 && <p>No hay datos</p>}
              <ol>
                {stats.topProductos.slice(0,10).map((p, idx) => (
                  <li key={p.nombre} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>{p.nombre} <small style={{ color: '#666' }}>({p.qty} uds)</small></div>
                      <div style={{ fontWeight: 700 }}>${p.ventas.toFixed(2)}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h5>Lista de ventas (reciente)</h5>
          <div className="card p-3">
            {data === 0 && <p>No hay ventas</p>}
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map(v => (
                  <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{new Date(v.created_at || v.createdAt).toLocaleString()}</td>
                      <td>
                        {
                          (() => {
                            const items = v.detalle_ventas || []
                            if (items.length === 0) return <span>-</span>
                            return (
                              <details>
                                <summary>{items.length} item{items.length > 1 ? 's' : ''}</summary>
                                <ul style={{ margin: '8px 0 0 16px' }}>
                                  {items.map((it, idx) => (
                                    <li key={idx}>{(it.producto.nombre)} x{it.cantidad}{it.precio_unitario ? ` — $${Number(it.precio_unitario).toFixed(2)}` : ''}</li>
                                  ))}
                                </ul>
                              </details>
                            )
                          })()
                        }
                      </td>
                      <td>${Number(v.total).toFixed(2)}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
