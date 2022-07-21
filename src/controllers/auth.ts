import Jwt from 'jsonwebtoken'
import User, { UserPayload } from '../models/User'
import { UserDetailsResponse } from './users'

interface LoginPayload {
  username: string
  password: string
}

export class AuthController {
  public async register(data: UserPayload): Promise<UserDetailsResponse> {
    return register(data)
  }

  public async login(body: LoginPayload) {
    return login(body)
  }
}

const register = async (data: UserPayload): Promise<UserDetailsResponse> => {
  const { username, email, password, profilePic, isAdmin } = data

  const params: any = { profilePic, isAdmin }

  if (username) {
    // Checking if user is already in the database
    const user = await User.findOne({ username })
    if (user) throw new Error('Username already exists.')
    params.username = username
  }

  if (email) {
    // Checking if user is already in the database
    const user = await User.findOne({ email })
    if (user) throw new Error('Email already exists.')
    params.email = email
  }

  if (password) {
    // Hash passwords
    params.password = User.hashPassword(password)
  }

  const user = new User(params)

  const savedUser = await user.save()

  if (!savedUser) throw new Error(`Unable to create user!`)

  return {
    userId: savedUser.userId,
    username: savedUser.username,
    email: savedUser.email,
    profilePic: savedUser.profilePic,
    isAdmin: savedUser.isAdmin
  }
}

const login = async ({ username, password }: LoginPayload) => {
  // Authenticate User
  const user = await User.findOne({ username })
  if (!user) throw new Error('Username is not found.')

  const validPass = user.comparePassword(password)
  if (!validPass) throw new Error('Invalid password.')

  const userResponse = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  }
  const accessToken = Jwt.sign(userResponse, process.env.SECRET_KEY as string, {
    expiresIn: '5d'
  })

  return {
    accessToken,
    userResponse
  }
}
