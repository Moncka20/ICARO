import * as usuariosModel from '../lib/usuariosModel'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

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
  // If the caller provided email+password, create the auth user first (server-side)
  // and then create the profile row in `usuarios` with id = auth user id.
  const { password, email, ...rest } = payload || {}

  if (password && email) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) throw { status: 500, message: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required to create auth users.' }

    const supabaseAdmin = createClient(SUPABASE_URL, serviceRoleKey)

    try {
      // Prefer the admin.createUser API when available
      let createdUser = null

      if (supabaseAdmin.auth && supabaseAdmin.auth.admin && typeof supabaseAdmin.auth.admin.createUser === 'function') {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { nombre: rest.nombre || '' },
        })
        if (error) throw error
        createdUser = data?.user || data
      } else if (supabaseAdmin.auth && typeof supabaseAdmin.auth.signUp === 'function') {
        // Fallback: signUp may work with service key
        const { data, error } = await supabaseAdmin.auth.signUp({ email, password })
        if (error) throw error
        createdUser = data?.user || data
      } else {
        throw { status: 500, message: 'Supabase admin API not available on this SDK version.' }
      }

      const userId = createdUser?.id
      if (!userId) throw { status: 500, message: 'Failed to obtain created auth user id' }

      const profilePayload = { id: userId, nombre: rest.nombre, rol: rest.rol }
      const profile = await usuariosModel.createUsuario(profilePayload)
      return { data: profile, status: 201 }
    } catch (err) {
      console.error('Error creating auth user:', err)
      // If Supabase created the auth user but profile creation failed, you might need cleanup.
      throw err
    }
  }

  // No email/password provided — create profile directly (legacy behavior)
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
