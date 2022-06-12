import { AES } from 'crypto-js'
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
  comparePassword(password: string): string
}

interface IUserModel extends Model<IUserDocument> {
  hashPassword(password: string): string
}

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

// Static Methods
userSchema.static('hashPassword', (password: string): string => {
  return AES.encrypt(password, process.env.SECRET_KEY as string).toString()
})

// Instance Methods
userSchema.method('comparePassword', function (password: string): boolean {
  const decryptedPassword = AES.decrypt(
    this.password,
    process.env.SECRET_KEY as string
  ).toString()
  return decryptedPassword === password
})

export const User: IUserModel = model<IUserDocument, IUserModel>(
  'User',
  userSchema
)

export default User
