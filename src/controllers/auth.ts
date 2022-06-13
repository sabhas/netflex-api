import User, { UserPayload } from '../models/User'
import { UserDetailsResponse } from './users'

export class AuthController {
  public async register(data: UserPayload): Promise<UserDetailsResponse> {
    return register(data)
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
    params.username = username
  }

  if (password) {
    // Hash passwords
    params.password = User.hashPassword(password)
  }

  const user = new User(params)

  const savedUser = await user.save()

  if (!savedUser) throw new Error(`Unable to create user!`)

  return {
    id: savedUser.id,
    username: savedUser.username,
    email: savedUser.email,
    profilePic: savedUser.profilePic,
    isAdmin: savedUser.isAdmin
  }
}
