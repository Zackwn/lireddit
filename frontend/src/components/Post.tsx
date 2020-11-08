/* eslint-disable react/prop-types */
import { Box, Heading, Text, BoxProps } from '@chakra-ui/core';
import React from 'react';

type PostProps = BoxProps & {
  title: string,
  text: string
}

const Post: React.FC<PostProps> = ({ children: _, text, title, ...atributtes }) => {
  return (
    <Box
      shadow="md"
      borderWidth="1px"
      p={5}
      {...atributtes}
    >
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{text}</Text>
    </Box>
  )
}

export default Post;