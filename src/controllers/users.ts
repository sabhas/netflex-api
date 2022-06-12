import User, { UserPayload } from 'src/models/User'

interface UserDetailsResponse {
  id: number
  username: string
  email: string
  profilePic: string
  isAdmin?: boolean
}

export class UserController {
  public async updateUser(
    userId: number,
    body: UserPayload
  ): Promise<UserDetailsResponse> {
    return updateUser(userId, body)
  }
}

const updateUser = async (
  id: number,
  data: UserPayload
): Promise<UserDetailsResponse> => {
  const { username, email, password, profilePic, isAdmin } = data

  const params: any = { profilePic, isAdmin }

  if (username) {
    // Checking if user is already in the database
    const user = await User.findOne({ username })
    if (user && user.id !== id) throw new Error('Username already exists.')
    params.username = username
  }

  if (email) {
    // Checking if user is already in the database
    const user = await User.findOne({ email })
    if (user && user.id !== id) throw new Error('Email already exists.')
    params.username = username
  }

  if (password) {
    // Hash passwords
    params.password = User.hashPassword(password)
  }

  const updatedUser = await User.findOneAndUpdate({ id }, params, { new: true })

  if (!updatedUser) throw new Error(`Unable to find user with id: ${id}`)

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    profilePic: updatedUser.profilePic,
    isAdmin: updatedUser.isAdmin
  }
}
