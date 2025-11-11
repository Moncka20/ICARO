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
  // Try inserting as provided. If the schema doesn't contain the `contacto`
  // column (PostgREST PGRST204), retry without that property so the insert
  // can succeed on DBs that model the contact differently (e.g. contacto_id).
  const { data, error } = await supabase.from('proveedores').insert([payload]).select().single()

  if (!error) return data

  // If server complains about unknown 'contacto' column, retry without it.
  const msg = String(error.message || '')
  if (msg.includes("Could not find the 'contacto' column") || msg.includes("Could not find the \"contacto\" column")) {
    const safePayload = { ...payload }
    delete safePayload.contacto
    const { data: data2, error: error2 } = await supabase.from('proveedores').insert([safePayload]).select().single()
    if (error2) throw error2
    return data2
  }

  throw error
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
