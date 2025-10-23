export async function listProveedores() {
  const res = await fetch('/api/proveedores')
  if (!res.ok) throw new Error('Error al listar proveedores')
  return res.json()
}

export async function createProveedor(payload) {
  const res = await fetch('/api/proveedores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al crear proveedor')
  }
  return res.json()
}

export async function updateProveedor(id, payload) {
  const res = await fetch(`/api/proveedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al actualizar proveedor')
  }
  return res.json()
}

export async function deleteProveedor(id) {
  const res = await fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) {
    const err = await res.json()
    throw new Error(err.error || 'Error al eliminar proveedor')
  }
  return true
}
