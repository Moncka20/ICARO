import { supabase } from './supabaseClient'

export async function listUsuarios({ limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getUsuarioById(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createUsuario(payload) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUsuario(id, payload) {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUsuario(id) {
  const { error } = await supabase.from('usuarios').delete().eq('id', id)
  if (error) throw error
  return true
}
