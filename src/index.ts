import express from 'express'
import dotenv from 'dotenv'

import router from './routes'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api', router)

const port = process.env.PORT ?? 5000
app.listen(port, () => {
  console.log(`Server is running at port ${port}!`)
})
