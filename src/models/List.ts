import mongoose, { Schema, model, Document, Model } from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)
import { IMovie } from './Movie'
import { ListResponse } from 'src/controllers'

export interface ListPayload {
  title: string
  type: string
  genre: string
}

interface IListDocument extends ListPayload, Document {
  movies: Schema.Types.ObjectId[]
  id: number
  addMovie(movie: IMovie): Promise<ListResponse>
  removeMovie(movie: IMovie): Promise<ListResponse>
}

interface IList extends IListDocument {}

interface IListModel extends Model<IList> {}

const listSchema = new Schema<IListDocument>({
  title: {
    type: String,
    required: true,
    unique: true
  },
  type: { type: String },
  genre: { type: String },
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
})

listSchema.plugin(AutoIncrement, { inc_field: 'id' })

// Instance Methods

listSchema.method('addMovie', async function (movie: IMovie) {
  const movieObjectId = movie._id
  const movieIdIndex = this.users.indexOf(movieObjectId)
  if (movieIdIndex === -1) this.movies.push(movieObjectId)
  return this.save()
})

listSchema.method('removeMovie', async function (movie: IMovie) {
  const movieObjectId = movie._id
  const movieIdIndex = this.movies.indexOf(movieObjectId)
  if (movieIdIndex > -1) this.movie.splice(movieIdIndex, 1)
  return this.save()
})

export const List: IListModel = model<IList, IListModel>('List', listSchema)

export default List
