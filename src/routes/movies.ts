import { Router } from 'express'
import { MovieController } from 'src/controllers'
import { verifyToken, verifyAdmin } from 'src/middlewares'
import { createMovieValidation } from 'src/utils/validations'

const movieRouter = Router()
const movieController = new MovieController()

// CREATE

movieRouter.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { error, value: body } = createMovieValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = movieController.createMovie(body)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})
