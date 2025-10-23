import { supabase } from './supabaseClient'

export async function listProductos({ limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getProductoById(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProducto(payload) {
  const { data, error } = await supabase
    .from('productos')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProducto(id, payload) {
  const { data, error } = await supabase
    .from('productos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProducto(id) {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
  return true
}
