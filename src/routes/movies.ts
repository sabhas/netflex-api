import { Router } from 'express'
import { MovieController } from '../controllers'
import { verifyToken, verifyAdmin } from '../middlewares'
import {
  createMovieValidation,
  getRandomMovieValidation,
  updateMovieValidation
} from '../utils/validations'

const movieRouter = Router()
const controller = new MovieController()

// CREATE

movieRouter.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { error, value: body } = createMovieValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = controller.create(body)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// UPDATE

movieRouter.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params
  const { error, value: body } = updateMovieValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = controller.update(parseInt(id), body)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// GET ALL (only admin operation)

movieRouter.get('/', verifyAdmin, async (_, res) => {
  try {
    const response = controller.getAll()
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
    const response = controller.getRandom(isSeries)
    res.status(200).send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Get by id

movieRouter.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    const movie = await controller.findById(parseInt(id))
    res.status(200).send(movie)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Get by title

movieRouter.get('/by/title/:title', verifyToken, async (req, res) => {
  const { title } = req.params
  try {
    const movie = await controller.findByTitle(title)
    res.status(200).send(movie)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

export default movieRouter
