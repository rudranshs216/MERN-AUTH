const Joi = require('joi')
const { JWT_SECRET } = require('../../config')
const { default: RefreshToken } = require('../../models/refresh')
const { default: User } = require('../../models/user')
const { default: CustomErrorHandler } = require('../../services/CustomErrorHandler')
const { default: JwtService } = require('../../services/JwtService')

class refreshController {
  async refresh (req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required()
    })
    const { error } = refreshSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    let refreshtoken
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token
      })
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
      }
      let user_id
      try {
        const { _id } = JwtService.verify(req.body.refresh_token, JWT_SECRET)
        user_id = _id
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
      }
      const user = await User.findOne({ _id: user_id });
      if (!user) {
          return next(CustomErrorHandler.unAuthorized('No user found!'));
      }

      // tokens
      // Toekn
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', JWT_SECRET);
  // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });

    } catch (error) {
        return next(new Error('Something went wrong ' + error.message));
    }
  }
}

module.exports = new refreshController()
