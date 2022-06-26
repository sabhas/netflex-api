import { RequestHandler } from 'express'

export const verifyAdmin: RequestHandler = (req, res, next) => {
  const { user } = req

  if (!user?.isAdmin) {
    return res
      .status(401)
      .send('You are not authorized; Admin account required!')
  }
  next()
}
