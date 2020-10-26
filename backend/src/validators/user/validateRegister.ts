import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../../constants"
import { FieldError } from "../../resolvers/user/FieldError"
import { UserOptionsInput } from "../../resolvers/user/UserOptionsInput"

export const validateRegister = (userInputOptions: UserOptionsInput) => {
  const errors: FieldError[] = []
  if (!userInputOptions.email.includes('@')) {
    errors.push({
      field: 'email',
      message: 'invalid email'
    })
  }

  if (userInputOptions.username.includes('@')) {
    errors.push({
      field: 'username',
      message: 'cannot include an @'
    })
  }

  if (userInputOptions.username.length <= MIN_USERNAME_LENGTH) {
    errors.push({
      field: 'username',
      message: `length must be greater than ${MIN_USERNAME_LENGTH}`
    })
  }

  if (userInputOptions.password.length <= MIN_PASSWORD_LENGTH) {
    errors.push({
      field: 'password',
      message: `length must be greater than ${MIN_PASSWORD_LENGTH}`
    })
  }

  return errors
}