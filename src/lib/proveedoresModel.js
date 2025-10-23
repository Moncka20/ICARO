import { supabase } from './supabaseClient'

export async function listProveedores({ limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getProveedorById(id) {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProveedor(payload) {
  const { data, error } = await supabase
    .from('proveedores')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProveedor(id, payload) {
  const { data, error } = await supabase
    .from('proveedores')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProveedor(id) {
  const { error } = await supabase.from('proveedores').delete().eq('id', id)
  if (error) throw error
  return true
}
