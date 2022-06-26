import mongoose, { Schema, model, Document, Model } from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)

export interface MoviePayload {
  title: string
  desc: string
  img: string
  imgTitle: string
  imgSm: string
  trailer: string
  video: string
  year: string
  limit: number
  genre: string
  isSeries: boolean
}

interface IMovieDocument extends MoviePayload, Document {
  id: number
}

interface IMovie extends IMovieDocument {}
interface IMovieModel extends Model<IMovie> {
  getRandom(isSeries: boolean): Promise<IMovie>
}

const movieSchema = new Schema<IMovieDocument>(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false }
  },
  { timestamps: true }
)
movieSchema.plugin(AutoIncrement, { inc_field: 'id' })

// Static Methods
movieSchema.static('getRandom', async function (isSeries: boolean) {
  const count = await this.count()
  const rand = Math.floor(Math.random() * count)
  const randomDoc = await this.findOne({ isSeries }).skip(rand)
  return randomDoc
})

export const Movie: IMovieModel = model<IMovie, IMovieModel>(
  'Movie',
  movieSchema
)

export default Movie
