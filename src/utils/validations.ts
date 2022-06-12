import Joi from 'joi'

const usernameSchema = Joi.string().alphanum().min(3).max(16)
const passwordSchema = Joi.string().min(6).max(1024)
const emailSchema = Joi.string().email()

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
