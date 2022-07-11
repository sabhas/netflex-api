import { Router } from 'express'
import { MovieController } from 'src/controllers'
import { verifyToken, verifyAdmin } from 'src/middlewares'
import {
  createMovieValidation,
  getRandomMovieValidation,
  updateMovieValidation
} from 'src/utils/validations'

const router = Router()
const controller = new MovieController()

// CREATE

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
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

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
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

router.get('/', verifyAdmin, async (_, res) => {
  try {
    const response = controller.getAll()
    res.status(200).json(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

//GET RANDOM

router.get('/random', verifyToken, async (req, res) => {
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

router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  try {
    const movie = await controller.findById(parseInt(id))
    res.status(200).send(movie)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Get by title

router.get('/by/title/:title', verifyToken, async (req, res) => {
  const { title } = req.params
  try {
    const movie = await controller.findByTitle(title)
    res.status(200).send(movie)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})
