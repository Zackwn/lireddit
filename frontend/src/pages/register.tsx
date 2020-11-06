import React from 'react'
import { Form, Formik } from "formik"
import { FormControl, Box, Button } from '@chakra-ui/core'
import InputField from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { validateRequiredFields } from '../utils/validateRequiredFields'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Layout from '../components/Layout'

interface RegisterProps { }

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter()
  const [, Register] = useRegisterMutation()

  return (
    <Layout variant="small" >
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const FormErrors = validateRequiredFields(values)

          if (FormErrors) {
            return setErrors({ ...FormErrors })
          }

          console.log('register...')

          const response = await Register({
            options: {
              email: values.email,
              username: values.username,
              password: values.password
            }
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
              type='text'
            />
            <Box mt={4}>
              <InputField
                label='Email'
                name='email'
                placeholder='email'
                type='email'
              />
            </Box>
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
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Register)