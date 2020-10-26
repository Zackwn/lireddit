import React from 'react'
import { Box } from '@chakra-ui/core'

interface WrapperProps {
  variant?: "small" | "regular"
  children: JSX.Element
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }: WrapperProps) => {
  return (
    <Box
      mt={8}
      maxW={variant === "small" ? "400px" : "800px"}
      w="100%"
      mx="auto"
    >
      {children}
    </Box>
  )
}

export default Wrapper