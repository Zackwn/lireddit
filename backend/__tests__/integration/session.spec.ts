import request from 'supertest'
import { appoloTest } from '../utils/createApolloTestServer'

let ApolloTest: appoloTest

const registerUserMutation = `mutation Register($options: UserOptionsInput!) {
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

const loginUserMutation = `mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
         field
         message
       }
       user {
         username
       }
     }
   }
  `

const meUserQuery = `query Me {
    me {
      id
      username
      createdAt
      updatedAt
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

  it('should successfully register a user', async (done) => {
    const response: any = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: registerUserMutation,
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

  it('should register a user and then fetch him', async (done) => {
    const user = {
      username: 'test user 2',
      email: 'test@test.com2',
      password: 'testpassword2'
    }

    const responseCreateUser = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: registerUserMutation,
        variables: {
          options: user
        }
      })

    const cookie = responseCreateUser.headers['set-cookie']

    const response = await request(ApolloTest.expressApp)
      .post('/graphql')
      .set('Cookie', [cookie])
      .send({
        query: meUserQuery,
        variables: {}
      })

    expect(response.body.data?.me?.username).toBe(user.username)
    done()
  })

  it('should register a user and then login', async (done) => {
    const user = {
      username: 'test user 3',
      email: 'test@test.com3',
      password: 'testpassword3'
    }

    await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: registerUserMutation,
        variables: {
          options: user
        }
      })

    const response = await request(ApolloTest.expressApp)
      .post('/graphql')
      .send({
        query: loginUserMutation,
        variables: {
          usernameOrEmail: user.email,
          password: user.password
        }
      })

    expect(response.body.data?.login?.user?.username).toBe(user.username)
    done()
  })

})