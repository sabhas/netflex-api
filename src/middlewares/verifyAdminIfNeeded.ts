import { RequestHandler } from 'express'

export const verifyAdminIfNeeded: RequestHandler = (req, res, next) => {
  const { user } = req
  const id = parseInt(req.params.id)

  if (!user?.isAdmin && user?.userId !== id) {
    return res.status(401).send('You are not authorized!')
  }
  next()
}
