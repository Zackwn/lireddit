import { Box, Button, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { useRouter } from 'next/router'

const CreatePost: React.FC<{}> = () => {
  const [, createPost] = useCreatePostMutation()
  const router = useRouter()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const errors = validateRequiredFields(values)

          if (errors) {
            return setErrors(errors)
          }

          await createPost({ options: values })

          router.push('/')
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
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost);