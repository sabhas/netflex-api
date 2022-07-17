import { Router } from 'express'
import { UserController } from '../controllers'
import { verifyToken, verifyAdminIfNeeded } from '../middlewares'
import {
  updateUserValidation,
  deleteUserValidation
} from '../utils/validations'

const userRouter = Router()
const controller = new UserController()

// update user
userRouter.patch('/:id', verifyToken, verifyAdminIfNeeded, async (req, res) => {
  const { user } = req.user
  const { id } = req.params

  // only an admin can update `isAdmin` fields
  const { error, value: body } = updateUserValidation(req.body, user!.isAdmin)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const response = await controller.updateUser(parseInt(id), body)
    res.send(response)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

// delete user
userRouter.delete(
  '/:id',
  verifyToken,
  verifyAdminIfNeeded,
  async (req, res) => {
    const { user } = req
    const { id } = req.params

    // only an admin can delete user without providing password
    const { error, value: data } = deleteUserValidation(req.body, user!.isAdmin)
    if (error) return res.status(400).send(error.details[0].message)

    try {
      await controller.deleteUser(parseInt(id), data, user!.isAdmin)
      res.status(200).send('Account Deleted!')
    } catch (err: any) {
      res.status(403).send(err.toString())
    }
  }
)

// get a user
userRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const response = await controller.getUser(parseInt(id))
    res.send(response)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

// get all users (only admin can access this api endpoint)
userRouter.get('/', verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const users = await controller.getAll()
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json('You are not allowed to see all users!')
  }
})

export default userRouter
