import * as proveedoresModel from '../lib/proveedoresModel'

export async function list(params = {}) {
  const data = await proveedoresModel.listProveedores(params)
  return { data }
}

export async function get(id) {
  const data = await proveedoresModel.getProveedorById(id)
  if (!data) throw { status: 404, message: 'Proveedor no encontrado' }
  return { data }
}

export async function create(payload, ctx = {}) {
  const data = await proveedoresModel.createProveedor(payload)
  return { data, status: 201 }
}

export async function update(id, payload, ctx = {}) {
  const data = await proveedoresModel.updateProveedor(id, payload)
  return { data }
}

export async function remove(id, ctx = {}) {
  await proveedoresModel.deleteProveedor(id)
  return { data: null, status: 204 }
}
