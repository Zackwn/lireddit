export const registerUserMutation = `mutation Register($options: UserOptionsInput!) {
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

export const loginUserMutation = `mutation Login($usernameOrEmail: String!, $password: String!) {
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