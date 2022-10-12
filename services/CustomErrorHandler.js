class CustomErrorHandler extends Error {
  constructor (status, msg) {
    super()
    this.status = status
    this.message = msg
  }

  static alreadyExist (message) {
    return new CustomErrorHandler(409, message)
  }
  static wrongCredentials (message = 'Email or Password is Wrong!') {
    return new CustomErrorHandler(401, message)
  }
  static  unAuthorized (message = 'unAuthorized') {
    return new CustomErrorHandler(401, message)
  }
}
export default CustomErrorHandler
