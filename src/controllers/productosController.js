import * as productosModel from '../lib/productosModel'

export async function list(params = {}) {
  // params can include pagination or filters
  const data = await productosModel.listProductos(params)
  return { data }
}

export async function get(id) {
  const data = await productosModel.getProductoById(id)
  if (!data) throw { status: 404, message: 'Producto no encontrado' }
  return { data }
}

export async function create(payload, ctx = {}) {
  // ctx could contain user info for permission checks
  const data = await productosModel.createProducto(payload)
  return { data, status: 201 }
}

export async function update(id, payload, ctx = {}) {
  const data = await productosModel.updateProducto(id, payload)
  return { data }
}

export async function remove(id, ctx = {}) {
  await productosModel.deleteProducto(id)
  return { data: null, status: 204 }
}
