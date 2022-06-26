import Joi from 'joi'

const usernameSchema = Joi.string().alphanum().min(3).max(16)
const passwordSchema = Joi.string().min(6).max(1024)
const emailSchema = Joi.string().email()

export const registerUserValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    username: usernameSchema.required(),
    password: passwordSchema.required(),
    email: emailSchema.required(),
    profilePic: Joi.string(),
    isAdmin: Joi.boolean()
  }).validate(data)

export const updateUserValidation = (
  data: any,
  isAdmin: boolean = false
): Joi.ValidationResult => {
  const validationChecks: any = {
    username: usernameSchema,
    password: passwordSchema,
    email: emailSchema
  }
  if (isAdmin) {
    validationChecks.isAdmin = Joi.boolean()
  }
  return Joi.object(validationChecks).validate(data)
}

export const deleteUserValidation = (
  data: any,
  isAdmin: boolean = false
): Joi.ValidationResult =>
  Joi.object(
    isAdmin
      ? {}
      : {
          password: passwordSchema.required()
        }
  ).validate(data)

export const loginValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    username: usernameSchema.required(),
    password: passwordSchema.required()
  }).validate(data)

export const createMovieValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    img: Joi.string().required(),
    imgTitle: Joi.string().required(),
    imgSm: Joi.string().required(),
    trailer: Joi.string().required(),
    video: Joi.string().required(),
    year: Joi.string().required(),
    limit: Joi.string().required(),
    genre: Joi.string().required(),
    isSeries: Joi.boolean()
  }).validate(data)
