

const ErrorsOnLogin = (err) => {
  if (!err.code) {
    return { error: 404, message: 'This email is not registered, please signup' }
  }
  else { return ({ error: 505 }) }
}

const ErrorsOnSignup = (err) => {
  if (err.code == '23505') {
    if (err.constraint === 'users_username_key') {
      return { error: 404, message: 'another user with this username alredy exists, please try another username' }
    }
    if (err.constraint == 'users_email_key') {
      return { error: 404, message: 'This email is alredy registered, please login' }
    }
  }
}

export { ErrorsOnSignup, ErrorsOnLogin }
