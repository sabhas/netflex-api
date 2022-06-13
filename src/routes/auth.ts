import { Router } from 'express'
import { AuthController } from '../controllers'
import { registerUserValidation } from 'src/utils/validations'

const authRouter = Router()
const controller = new AuthController()

//REGISTER
authRouter.post('/register', async (req, res) => {
  const { error, value: body } = registerUserValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = controller.register(body)
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})
