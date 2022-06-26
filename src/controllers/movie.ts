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

export class MovieController {
  public async createMovie(body: MoviePayload): Promise<MovieResponse> {
    return createMovie(body)
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
