import React from 'react';
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link'
import { Link, Stack, Flex, Heading, Button } from '@chakra-ui/core';
import Post from '../components/Post'

const Index: React.FC = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  })

  if (!data && !fetching) {
    return <div>You got query failed for some reason</div>
  }

  return (
    <Layout>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        mb={5}
      >
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link>create post</Link>
        </NextLink>
      </Flex>
      <Stack spacing={8}>
        {!data ? null : data.posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            text={post.textSnippet}
          />
        ))}
      </Stack>
      {data ? <Flex>
        <Button
          m='auto'
          my={8}
          isLoading={fetching}
        >load more</Button>
      </Flex> : null}
    </Layout >
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)