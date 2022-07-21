import { Router } from 'express'
import { AuthController } from '../controllers'
import { registerUserValidation, loginValidation } from '../utils/validations'

const authRouter = Router()
const controller = new AuthController()

//REGISTER
authRouter.post('/register', async (req, res) => {
  const { error, value: body } = registerUserValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = await controller.register(body)
    res.send(user)
  } catch (err) {
    console.log(`[err]`, err)
    res.status(400).send(err.toString())
  }
})

authRouter.post('/login', async (req, res) => {
  const { error, value: body } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const response = await controller.login(body)
    res.send(response)
  } catch (err: any) {
    res.status(400).send(err.toString())
  }
})

export default authRouter
