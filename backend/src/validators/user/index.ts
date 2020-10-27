import { FieldError } from "src/resolvers/user/FieldError"
import { UserOptionsInput } from "../../resolvers/user/UserOptionsInput"
import { validateUserEmail, validateUserUsername, validateUserPassword } from "./validateUser"

export const validateUser = (userInputOptions: UserOptionsInput) => {
  let errors: FieldError[] = [
    ...validateUserEmail(userInputOptions.email),
    ...validateUserUsername(userInputOptions.username),
    ...validateUserPassword(userInputOptions.password)
  ]
  return errors
}