import * as ventasController from '../../../controllers/ventasController'

export default async function handler(req, res) {
  try {
    const { id } = req.query

    if (req.method === 'GET') {
      const result = await ventasController.get(id)
      return res.status(200).json(result.data)
    }

    // optionally handle DELETE or PUT in future
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Server error' })
  }
}
