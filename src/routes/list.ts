import { Router } from 'express'
import { verifyToken, verifyAdmin } from 'src/middlewares'
import { ListController } from 'src/controllers'
import {
  createListValidation,
  updateListValidation,
  getListValidation
} from 'src/utils/validations'

const router = Router()
const controller = new ListController()

router.get('/', verifyToken, async (req, res) => {
  const { error, value: body } = createListValidation(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const response = await controller.create(body)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// CREATE

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { error, value: query } = getListValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await controller.get(query)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Update

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params
  const { error, value: body } = updateListValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await controller.update(parseInt(id), body)
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Add movie to list

router.post('/:listId/:movieId', verifyToken, verifyAdmin, async (req, res) => {
  const { listId, movieId } = req.params
  try {
    const response = await controller.addMovieToList(
      parseInt(listId),
      parseInt(movieId)
    )
    res.send(response)
  } catch (err) {
    res.status(403).send(err.toString())
  }
})

// Remove movie from list

router.delete(
  '/:listId/:movieId',
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { listId, movieId } = req.params
    try {
      const response = await controller.removeMovieFromList(
        parseInt(listId),
        parseInt(movieId)
      )
      res.send(response)
    } catch (err) {
      res.status(403).send(err.toString())
    }
  }
)

// DELETE

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await controller.delete(parseInt(id))
    res.send('List deleted!')
  } catch (err) {
    res.status(403).send(err.toString())
  }
})
