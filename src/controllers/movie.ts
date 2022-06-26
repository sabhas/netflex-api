import Movie, { MoviePayload } from 'src/models/Movie'

interface MovieResponse {
  id: number
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

interface FindBy {
  id?: number
  title?: string
}

export class MovieController {
  public async createMovie(body: MoviePayload): Promise<MovieResponse> {
    return createMovie(body)
  }

  public async getAll(): Promise<MovieResponse[]> {
    return getAll()
  }

  public async getRandomMovie(isSeries: boolean): Promise<MovieResponse> {
    return getRandomMovie(isSeries)
  }

  public async findById(id: number): Promise<MovieResponse> {
    return getMovie({ id })
  }
}

const createMovie = async (data: MoviePayload): Promise<MovieResponse> => {
  const alreadyExists = await Movie.findOne({ title: data.title })
  if (alreadyExists)
    throw new Error('Movie with provided title already exists.')

  const movie = new Movie(data)
  const savedMovie = await movie.save()

  return {
    id: savedMovie.id,
    title: savedMovie.title,
    desc: savedMovie.desc,
    img: savedMovie.img,
    imgTitle: savedMovie.imgTitle,
    imgSm: savedMovie.imgSm,
    trailer: savedMovie.trailer,
    video: savedMovie.video,
    year: savedMovie.year,
    limit: savedMovie.limit,
    genre: savedMovie.genre,
    isSeries: savedMovie.isSeries
  }
}

const getAll = async (): Promise<MovieResponse[]> =>
  await Movie.find({})
    .select({
      _id: 0,
      title: 1,
      desc: 1,
      img: 1,
      imgTitle: 1,
      imgSm: 1,
      trailer: 1,
      video: 1,
      year: 1,
      limit: 1,
      genre: 1,
      isSeries: 1
    })
    .exec()

const getRandomMovie = async (isSeries: boolean): Promise<MovieResponse> => {
  const movie = await Movie.getRandom(isSeries)

  if (!movie) throw new Error('something went wrong while getting movie.')

  return movie
}

const getMovie = async (findBy: FindBy): Promise<MovieResponse> => {
  const movie = await Movie.findOne(findBy)

  if (!movie) throw new Error('No resource found')

  return movie
}
