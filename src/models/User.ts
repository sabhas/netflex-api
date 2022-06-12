import mongoose, { Schema, model, Document, Model } from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)

export interface UserPayload {
  username: string
  email: string
  password: string
  profilePic: string
  isAdmin?: boolean
}

interface IUserDocument extends UserPayload, Document {
  id: number
}

interface IUser extends IUserDocument {}
interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
userSchema.plugin(AutoIncrement, { inc_field: 'id' })

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema)

export default User
