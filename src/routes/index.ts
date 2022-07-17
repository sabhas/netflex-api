import express from 'express'

import authRouter from './auth'
import listRouter from './list'
import movieRouter from './movies'
import userRouter from './users'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/list', listRouter)
router.use('/movie', movieRouter)
router.use('/user', userRouter)

export default router
