import { Box, Button, Flex, Link } from '@chakra-ui/core'
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

const NavBar: React.FC = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching: meFetching }] = useMeQuery({
    pause: isServer()
  })

  let body: JSX.Element | null = null
  // data is loading
  if (meFetching) {

    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Register</Link>
        </NextLink>
      </>
    )
    // user logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant='link'
          isLoading={logoutFetching}
          onClick={() => {
            logout()
          }}
        >logout</Button>
      </Flex>
    )
  }

  return (
    <Flex
      bg='tan'
      p={4}
      position='sticky'
      top={0}
      zIndex={2}
    >
      <Box ml="auto">
        {body}
      </Box>
    </Flex>
  )
}

export default NavBar