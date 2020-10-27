import { Button, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper'

// eslint-disable-next-line react/prop-types
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={(values, { setErrors }) => {
          console.log(values)
        }}
      >
        <Form >
          <FormControl>
            <InputField
              name='newPassword'
              label='New Password'
              placeholder='new password'
              type='password'
            />
            <Button
              type='submit'
              mt={4}
              variantColor='teal'
            >
              change password
            </Button>
          </FormControl>
        </Form>
      </Formik>
    </Wrapper>
  )
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}

export default ChangePassword