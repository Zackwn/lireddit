type ObjectKeyString = Record<string, string>

export function validateRequiredFields(values: ObjectKeyString) {
  const errors: ObjectKeyString = {}
  if (values) {
    for (let value in values) {
      if (!values[value]) {
        errors[value] = 'This field cannot be empty'
      }
    }
  }
  for (let k in errors) {
    if (errors.hasOwnProperty(k)) {
      return errors
    }
  }
  return null
}