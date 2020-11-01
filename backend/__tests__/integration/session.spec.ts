import request from 'supertest'
import { appoloTest } from '../utils/createApolloTestServer'

let ApolloTest: appoloTest

const createUserMutation = `mutation Register($options: UserOptionsInput!) {
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
    const response: any = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: createUserMutation,
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

  it('should create a user and then fetch him', async (done) => {
    const user = {
      username: 'test user 2',
      email: 'test@test.com2',
      password: 'testpassword2'
    }

    const responseCreateUser = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: createUserMutation,
        variables: {
          options: user
        }
      })

    const cookie = responseCreateUser.headers['set-cookie']

    const response = await request(ApolloTest.expressApp)
      .post('/graphql')
      .set('Cookie', [cookie])
      .send({
        query: `query Me {
          me {
            id
            username
            createdAt
            updatedAt
          }
        }`,
        variables: {}
      })

    expect(response.body.data?.me?.username).toBe(user.username)
    done()
  })
})