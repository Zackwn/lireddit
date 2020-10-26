import React from 'react';
import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index: React.FC = () => {
  const [{ data }] = usePostsQuery()

  return (
    <>
      <NavBar />
      {/* <div>Langing page</div> */}
      {!data ? null : data.posts.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)