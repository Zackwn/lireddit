import React from 'react'
import { Form, Formik } from "formik"
import { FormControl, Box, Button } from '@chakra-ui/core'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { validateRequiredFields } from '../utils/validateRequiredFields'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
// import { toErrorMap } from '../utils/toErrorMap'

interface RegisterProps { }

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter()
  const [, Register] = useRegisterMutation()

  return (
    <Wrapper variant="small" >
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const FormErrors = validateRequiredFields(values)

          if (FormErrors) {
            return setErrors({ ...FormErrors })
          }

          console.log('register...')

          const response = await Register({
            password: values.password,
            username: values.username
          })

          const APIErrors = response.data?.register.errors
          if (APIErrors) {
            const mapAPIErrors = toErrorMap(APIErrors)
            setErrors(mapAPIErrors)
          } else if (response.data?.register.user) {
            router.push('/')
          }
        }}
      >{({ isSubmitting }) => (
        <Form>
          <FormControl>
            <InputField
              label="Username"
              name="username"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField
                label="Password"
                name="password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              variantColor="teal"
              isLoading={isSubmitting}
            >
              register
            </Button>
          </FormControl>
        </Form>
      )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)