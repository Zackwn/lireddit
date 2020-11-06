import { Box, Button, Flex, FormControl, Link } from '@chakra-ui/core'
import { Form, Formik } from 'formik'
import React from 'react'
import InputField from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { validateRequiredFields } from '../utils/validateRequiredFields'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'
import Layout from '../components/Layout'

const Login: React.FC = () => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const errors = validateRequiredFields(values)

          console.log(errors)

          if (errors) {
            return setErrors({
              ...errors
            })
          }

          console.log('login...')
          const response = await login({
            password: values.password,
            usernameOrEmail: values.usernameOrEmail
          })
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
                label='Username or Email'
                name='usernameOrEmail'
                placeholder='username or email'
              />
              <Box mt={4}>
                <InputField
                  label='Password'
                  name='password'
                  placeholder='password'
                  type='password'
                />
              </Box>
              <Flex mt={2}>
                <NextLink href='/forgot-password'>
                  <Link ml='auto'>forgot password?</Link>
                </NextLink>
              </Flex>
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
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Login)