import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string,
  placeholder: string,
  name: string,
  isTextarea?: boolean
}

// !!value => transform a value in a boolean
// ({value: _, ...rest}) => value will be ignored

const InputField: React.FC<InputFieldProps> = ({
  label,
  isTextarea = false,
  size: _,
  ...props
}: InputFieldProps) => {
  const [field, { error }] = useField(props)
  let InputOrTextarea = isTextarea ? Textarea : Input
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      { error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField;