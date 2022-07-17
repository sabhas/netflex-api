import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT as string)
  } catch (err) {
    throw new Error('Unable to connect to DB!')
  }

  console.log('Connected to DB!')
}
