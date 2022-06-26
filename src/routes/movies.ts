import { Router } from 'express'
import { MovieController } from 'src/controllers'
import { verifyToken, verifyAdmin } from 'src/middlewares'
import {
  createMovieValidation,
  getRandomMovieValidation
} from 'src/utils/validations'

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

// GET ALL (only admin operation)

movieRouter.get('/', verifyAdmin, async (_, res) => {
  try {
    const response = movieController.getAll()
    res.status(200).json(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

//GET RANDOM

movieRouter.get('/random', verifyToken, async (req, res) => {
  const { error, value: query } = getRandomMovieValidation(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  const isSeries = query.isSeries
  try {
    const response = movieController.getRandomMovie(isSeries)
    res.status(200).send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Get by id

movieRouter.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    const movie = await movieController.findById(parseInt(id))
    res.status(200).send(movie)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})
