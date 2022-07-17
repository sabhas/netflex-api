import List, { ListPayload } from '../models/List'
import Movie from '../models/Movie'
import { MovieResponse } from './movie'

export interface ListResponse {
  id: number
  title: string
  type: string
  genre: string
  movies: MovieResponse[]
}

interface GetListPayload {
  type: string
  genre: string
}

export class ListController {
  public async get(query: GetListPayload): Promise<ListResponse[]> {
    return getList(query)
  }

  public async create(body: ListPayload): Promise<ListResponse> {
    return createList(body)
  }

  public async update(
    id: number,
    body: Partial<ListPayload>
  ): Promise<ListResponse> {
    return updateList(id, body)
  }

  public async addMovieToList(
    listId: number,
    movieId: number
  ): Promise<ListResponse> {
    return addMovieToList(listId, movieId)
  }

  public async removeMovieFromList(
    listId: number,
    movieId: number
  ): Promise<ListResponse> {
    return removeMovieFromList(listId, movieId)
  }

  public async delete(id: number) {
    await deleteList(id)
  }
}

const getList = async ({
  type,
  genre
}: GetListPayload): Promise<ListResponse[]> =>
  (await List.find({ type, genre })
    .limit(10)
    .select({
      _id: 0,
      title: 1,
      type: 1,
      genre: 1
    })
    .populate({
      path: 'movie',
      select:
        'id title desc img imgTitle imgSm trailer video year limit genre isSeries -_id'
    })) as unknown as ListResponse[]

const createList = async (data: ListPayload): Promise<ListResponse> => {
  const alreadyExists = await List.findOne({ title: data.title })
  if (alreadyExists) throw new Error('List with given title already exists.')

  const list = new List(data)
  const savedList = await list.save()
  if (!savedList) throw new Error('An error occurred while saving list.')

  return {
    id: savedList.id,
    title: savedList.title,
    type: savedList.type,
    genre: savedList.genre,
    movies: []
  }
}

const updateList = async (
  id: number,
  data: Partial<ListPayload>
): Promise<ListResponse> => {
  const { title, type, genre } = data
  const params: any = { type, genre }

  if (title) {
    //check if title already exists
    const alreadyExists = await List.findOne({ title })
    if (alreadyExists) throw new Error('List with given title already exists.')
    params.title = title
  }

  const updatedList = (await List.findOneAndUpdate({ id }, params, {
    new: true
  })
    .select({
      _id: 0,
      id: 1,
      title: 1,
      type: 1,
      genre: 1
    })
    .populate({
      path: 'movie',
      select:
        'id title desc img imgTitle imgSm trailer video year limit genre isSeries -_id'
    })) as unknown as ListResponse
  if (!updatedList) throw new Error(`Unable to update list with id ${id}`)

  return updatedList
}

const deleteList = async (id: number) => {
  const list = List.findOne({ id })
  if (!list) throw new Error('List not found!')

  await list.remove()
}

const addMovieToList = async (
  listId: number,
  movieId: number
): Promise<ListResponse> => updateMoviesInList(listId, movieId, 'add')

const removeMovieFromList = async (
  listId: number,
  movieId: number
): Promise<ListResponse> => updateMoviesInList(listId, movieId, 'remove')

const updateMoviesInList = async (
  listId: number,
  movieId: number,
  action: 'add' | 'remove'
): Promise<ListResponse> => {
  const list = await List.findOne({ id: listId })
  if (!list)
    throw {
      code: 404,
      status: 'Not Found',
      message: 'List not found.'
    }

  const movie = await Movie.findOne({ id: movieId })
  if (!movie)
    throw {
      code: 404,
      status: 'Not Found',
      message: 'Movie not found.'
    }

  const updatedList =
    action === 'add'
      ? await list.addMovie(movie)
      : await list.removeMovie(movie)

  if (!updatedList)
    throw {
      code: 400,
      status: 'Bad Request',
      message: 'Unable to update list.'
    }

  return {
    id: updatedList.id,
    title: updatedList.title,
    type: updatedList.type,
    genre: updatedList.genre,
    movies: updatedList.movies
  }
}
