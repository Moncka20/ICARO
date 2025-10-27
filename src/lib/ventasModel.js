import { supabase } from './supabaseClient'

export async function listVentas({ limit = 100, offset = 0 } = {}) {
  // include detalle_ventas and the related producto name via join
  const { data, error } = await supabase
    .from('ventas')
    .select('*, detalle_ventas(*, producto:productos(nombre))')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getVentaById(id) {
  const { data, error } = await supabase
    .from('ventas')
    .select('*, detalle_ventas(*, producto:productos(nombre))')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createVenta(payload) {
  // payload: { cliente_id, usuario_id, metodo_pago, total, items: [{ producto_id, qty, precio_unitario, subtotal }] }
  const { items = [], ...venta } = payload

  // ensure numeric total and created_at
  if (venta.total !== undefined) venta.total = Number(venta.total) || 0
  if (!venta.created_at) venta.created_at = new Date().toISOString()

  // insert venta
  const { data: ventaData, error } = await supabase.from('ventas').insert([venta]).select().single()
  if (error) throw error

  const venta_id = ventaData.id

  // prepare detalle_ventas rows
  // build detalle_ventas rows — omit `subtotal` if the DB computes it (generated column)
  const detalles = (items || []).map(it => {
    const producto_id = it.producto_id || it.id || it.product_id || null
    const cantidad = Number(it.qty ?? it.cantidad ?? 0)
    const precio_unitario = Number(it.precio_unitario ?? it.precio ?? it.price ?? 0)
    // Many DB schemas compute subtotal as cantidad * precio_unitario (generated column).
    // To avoid errors inserting into a generated column, do not send `subtotal` here.
    return {
      venta_id,
      producto_id,
      cantidad,
      precio_unitario
    }
  })

  if (detalles.length) {
    const { error: dErr } = await supabase.from('detalle_ventas').insert(detalles)
    if (dErr) throw dErr
  }

  // return the full venta with detalles
  return await getVentaById(venta_id)
}
