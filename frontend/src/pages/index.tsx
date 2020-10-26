import React from 'react';
import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient';

const index: React.FC = () => {
  return (
    <>
      <NavBar />
      <div>Langing page, brave sucks</div>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(index);