import * as usuariosController from '../../../controllers/usuariosController'

export default async function handler(req, res) {
  const { id } = req.query
  try {
    if (req.method === 'GET') {
      const r = await usuariosController.get(id)
      return res.status(200).json(r.data)
    }

    if (req.method === 'PUT') {
      const r = await usuariosController.update(id, req.body)
      return res.status(r.status || 200).json(r.data)
    }

    if (req.method === 'DELETE') {
      await usuariosController.remove(id)
      return res.status(204).end()
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Server error' })
  }
}
