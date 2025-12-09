import { supabase } from './supabaseClient'

export async function listProductos({ limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('productos')
    .select('*, proveedor:proveedores(id, nombre)')
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

export async function decrementarStock(id, cantidad) {
  // Decrease stock for a product by the given quantity
  const { data, error } = await supabase.rpc('decrement_stock', {
    producto_id: id,
    cantidad: cantidad
  })
  if (error) throw error
  return data
}

export async function decrementarStockFallback(id, cantidad) {
  // Fallback: fetch current stock, subtract, and update (if rpc doesn't exist)
  const producto = await getProductoById(id)
  const nuevoStock = Math.max(0, (producto.stock || 0) - cantidad)
  return await updateProducto(id, { stock: nuevoStock })
}
