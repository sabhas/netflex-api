import { Router } from 'express'
import { UserController } from 'src/controllers'
import { verifyToken, verifyAdminIfNeeded } from 'src/middlewares'
import { updateUserValidation } from 'src/utils/validations'

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
