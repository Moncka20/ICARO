import * as productosController from '../../../controllers/productosController'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await productosController.list(req.query)
      return res.status(200).json(result.data)
    }

    if (req.method === 'POST') {
      const result = await productosController.create(req.body)
      return res.status(result.status || 201).json(result.data)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Server error' })
  }
}
