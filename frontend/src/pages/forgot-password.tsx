import React, { useState } from 'react';
import { Formik, Form } from 'formik'
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';

const ForgotPassword: React.FC = () => {
  const [, forgotPassword] = useForgotPasswordMutation()
  const [complete, setComplete] = useState(false)

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values, { }) => {
          console.log(values)
          await forgotPassword({ email: values.email })
          setComplete(true)
        }}
      >
        {({ isSubmitting }) => {
          return complete ? (
            <Box>
              if an accout with that email exists, we sent it an email to change password
            </Box>
          ) : (
              <Form>
                <InputField
                  name='email'
                  label='Email'
                  placeholder='email'
                />
                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  variantColor='teal'
                  mt={4}
                >
                  forgot password
              </Button>
              </Form>
            )
        }}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)