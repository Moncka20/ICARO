import * as usuariosModel from '../lib/usuariosModel'

export async function list(params = {}) {
  const data = await usuariosModel.listUsuarios(params)
  return { data }
}

export async function get(id) {
  const data = await usuariosModel.getUsuarioById(id)
  if (!data) throw { status: 404, message: 'Usuario no encontrado' }
  return { data }
}

export async function create(payload, ctx = {}) {
  // Note: user auth creation (signUp) is handled in login page; this endpoint is for profile rows or admin creation
  const data = await usuariosModel.createUsuario(payload)
  return { data, status: 201 }
}

export async function update(id, payload, ctx = {}) {
  const data = await usuariosModel.updateUsuario(id, payload)
  return { data }
}

export async function remove(id, ctx = {}) {
  await usuariosModel.deleteUsuario(id)
  return { data: null, status: 204 }
}
