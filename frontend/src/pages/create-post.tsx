import { Box, Button, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { createUrqlClient } from '../utils/createUrqlClient';
import { validateRequiredFields } from '../utils/validateRequiredFields';

const CreatePost: React.FC<{}> = () => {
  const [, createPost] = useCreatePostMutation()
  const router = useRouter()
  useIsAuth()

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const errors = validateRequiredFields(values)

          if (errors) {
            return setErrors(errors)
          }

          const { error } = await createPost({ options: values })
          if (!error) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormControl>
                <InputField
                  name='title'
                  placeholder='title'
                  label='Title'
                />
                <Box mt={4}>
                  <InputField
                    name='text'
                    placeholder='text'
                    label='Body'
                    isTextarea={true}
                  />
                </Box>
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  variantColor='teal'
                  type='submit'
                >create</Button>
              </FormControl>
            </Form>
          )
        }}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost);