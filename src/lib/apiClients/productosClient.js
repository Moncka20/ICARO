export async function listProductos() {
  const res = await fetch('/api/productos')
  if (!res.ok) throw new Error('Error al listar productos')
  return res.json()
}

export async function createProducto(payload) {
  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al crear producto')
  }
  return res.json()
}

export async function updateProducto(id, payload) {
  const res = await fetch(`/api/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al actualizar producto')
  }
  return res.json()
}

export async function deleteProducto(id) {
  const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) {
    const err = await res.json()
    throw new Error(err.error || 'Error al eliminar producto')
  }
  return true
}
