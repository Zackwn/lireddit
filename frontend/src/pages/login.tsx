import { Box, Button, FormControl } from '@chakra-ui/core'
import { Form, Formik } from 'formik'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { validateRequiredFields } from '../utils/validateRequiredFields'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Login: React.FC = () => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const errors = validateRequiredFields(values)

          console.log(errors)

          if (errors) {
            return setErrors({
              ...errors
            })
          }

          console.log('login...')
          const response = await login({ options: values })
          const error = response.data?.login.errors
          if (error) {
            const mapErrors = toErrorMap(error)
            setErrors({
              ...mapErrors
            })
          } else if (response.data?.login.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                label='Username'
                name='username'
                placeholder='username'
              />
              <Box mt={4}>
                <InputField
                  label='Password'
                  name='password'
                  placeholder='password'
                />
              </Box>
              <Button
                type='submit'
                isLoading={isSubmitting}
                variantColor='teal'
                mt={4}
              >login</Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login)