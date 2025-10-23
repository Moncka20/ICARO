export async function listUsuarios() {
  const res = await fetch('/api/usuarios')
  if (!res.ok) throw new Error('Error al listar usuarios')
  return res.json()
}

export async function createUsuario(payload) {
  const res = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al crear usuario')
  }
  return res.json()
}

export async function updateUsuario(id, payload) {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Error al actualizar usuario')
  }
  return res.json()
}

export async function deleteUsuario(id) {
  const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) {
    const err = await res.json()
    throw new Error(err.error || 'Error al eliminar usuario')
  }
  return true
}
