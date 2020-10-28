import { Box, Button, Flex, FormControl, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link'

// eslint-disable-next-line react/prop-types
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token
          })
          const data = response.data?.changePassword
          if (data?.errors) {
            const errorMap = toErrorMap(data.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
              // setErrors({ newPassword: errorMap.token })
            }
            setErrors(errorMap)
          } else if (data?.user) {
            // worked
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form >
            <FormControl>
              <InputField
                name='newPassword'
                label='New Password'
                placeholder='new password'
                type='password'
              />
              {tokenError ? (
                <Flex mt={2} >
                  <Box mr={1} style={{ color: "red" }}>{tokenError},</Box>
                  <NextLink href='/forgot-password'>
                    <Link>click here to get a new one</Link>
                  </NextLink>
                </Flex>
              ) : null}
              <Button
                type='submit'
                mt={4}
                isLoading={isSubmitting}
                variantColor='teal'
              >
                change password
          </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}

export default withUrqlClient(createUrqlClient)(ChangePassword)