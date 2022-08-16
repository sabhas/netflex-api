import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (err: any, user: any) => {
        if (err) res.status(401).json('Access token is not valid!')
        req.user = user
        next()
      }
    )
  } else {
    return res.status(401).json('You are not authenticated!')
  }
}
