import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../../constants"
import { FieldError } from "../../resolvers/user/FieldError"

export const validateUserPassword = (password: string, fieldName?: string) => {
  const errors: FieldError[] = []

  if (password.length <= MIN_PASSWORD_LENGTH) {
    errors.push({
      field: fieldName || 'password',
      message: `length must be greater than ${MIN_PASSWORD_LENGTH}`
    })
  }

  return errors
}

export const validateUserEmail = (email: string) => {
  const errors: FieldError[] = []

  if (!email.includes('@')) {
    errors.push({
      field: 'email',
      message: 'invalid email'
    })
  }

  return errors
}

export const validateUserUsername = (username: string) => {
  let errors: FieldError[] = []

  if (username.includes('@')) {
    errors.push({
      field: 'username',
      message: 'cannot include an @'
    })
  }

  if (username.length <= MIN_USERNAME_LENGTH) {
    errors.push({
      field: 'username',
      message: `length must be greater than ${MIN_USERNAME_LENGTH}`
    })
  }

  return errors
}