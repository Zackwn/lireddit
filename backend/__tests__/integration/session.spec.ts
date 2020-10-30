import request from 'supertest'
import { appoloTest } from '../utils/createApolloTestServer'

let ApolloTest: appoloTest

describe('User resolver session', () => {
  beforeAll(async (done) => {
    ApolloTest = new appoloTest()
    await ApolloTest.init()
    done()
  })

  afterAll(async (done) => {
    await ApolloTest.undo()
    await ApolloTest.stop()
    done()
  })

  it('should successfully create a user', async (done) => {
    const mutation = `mutation Register($options: UserOptionsInput!) {
      register(options: $options) {
         errors {
          message
        }
        user {
          id
          username
        }
      }
    }`

    const response: any = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          options: {
            username: 'test user',
            email: 'test@test.com',
            password: 'testpassword'
          }
        }
      })

    const responseUsername = response.body.data.register.user.username
    expect(responseUsername).toBeTruthy()
    return done()
  })

  // it('should create and get a user', async (done) => {
  //   const response = await ApolloTest.client.query({
  //     query: `query Me {
  //       me {
  //         id
  //         username
  //         createdAt
  //         updatedAt
  //       }
  //     }`,
  //     variables: {},
  //   })

  //   console.log(response)

  //   expect(2).toBe(2)
  //   done()
  // })

})