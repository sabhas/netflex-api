import User, { UserPayload } from 'src/models/User'

export interface UserDetailsResponse {
  id: number
  username: string
  email: string
  profilePic: string
  isAdmin?: boolean
}

export class UserController {
  public async getUser(id: number): Promise<UserDetailsResponse> {
    return getUser(id)
  }

  public async getAll(): Promise<UserDetailsResponse[]> {
    return getAll()
  }

  public async updateUser(
    userId: number,
    body: UserPayload
  ): Promise<UserDetailsResponse> {
    return updateUser(userId, body)
  }

  public async deleteUser(
    userId: number,
    body: { password?: string },
    isAdmin: boolean = false
  ) {
    return deleteUser(userId, isAdmin, body)
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

const deleteUser = async (
  id: number,
  isAdmin: boolean,
  { password }: { password?: string }
) => {
  const user = await User.findOne({ id })
  if (!user) throw new Error('User is not found.')

  if (!isAdmin) {
    const validPass = user.comparePassword(password!)
    if (!validPass) throw new Error('Invalid password.')
  }

  await User.deleteOne({ id })
}

const getUser = async (id: number): Promise<UserDetailsResponse> => {
  const user = await User.findOne({ id })

  if (!user) throw new Error('User is not found.')

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    isAdmin: user.isAdmin
  }
}

const getAll = async (): Promise<UserDetailsResponse[]> => {
  const users = await User.find()
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    isAdmin: user.isAdmin
  }))
}
