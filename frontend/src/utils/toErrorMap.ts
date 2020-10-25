import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  // Record<Type, Type> => { Type: Type }
  const mapErrors: Record<string, string> = {}
  errors.forEach(({ field, message }) => {
    mapErrors[field] = message
  })

  return mapErrors
}