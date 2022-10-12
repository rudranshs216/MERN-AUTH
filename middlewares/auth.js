const {
  default: CustomErrorHandler
} = require('../services/CustomErrorHandler')
const { default: JwtService } = require('../services/JwtService')

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return next(CustomErrorHandler.unAuthorized())
  }
  try {
    const { _id, role } = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized())
  }
}

module.exports = auth
