import * as ventasModel from '../lib/ventasModel'
import * as productosModel from '../lib/productosModel'

export async function list(params = {}) {
  const data = await ventasModel.listVentas(params)
  return { data }
}

export async function get(id) {
  const data = await ventasModel.getVentaById(id)
  if (!data) throw { status: 404, message: 'Venta no encontrada' }
  return { data }
}

export async function create(payload, ctx = {}) {
  const data = await ventasModel.createVenta(payload)
  
  // Decrease stock for each product in the venta
  const items = payload.items || []
  for (const item of items) {
    const producto_id = item.producto_id || item.id
    const cantidad = Number(item.qty || item.cantidad || 0)
    if (producto_id && cantidad > 0) {
      try {
        await productosModel.decrementarStock(producto_id, cantidad)
      } catch (err) {
        // Log error but don't fail the venta creation
        console.error(`Error decreasing stock for producto ${producto_id}:`, err)
      }
    }
  }
  
  return { data, status: 201 }
}
