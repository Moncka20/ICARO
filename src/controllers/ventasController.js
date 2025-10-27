import * as ventasModel from '../lib/ventasModel'

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
  return { data, status: 201 }
}
