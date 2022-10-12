import Joi from 'joi'
import User from '../../models/user'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import RefreshToken from '../../models/refresh'
import JwtService from '../../services/JwtService'

class LoginController {
  async login (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
    })
    const { error } = loginSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials())
      }
      const match = bcrypt.compare(req.body.password, user.password)
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials())
      }
      const refreshToken = JwtService.sign(
        { _id: user._id, role: user.role },
        '1y'
      )
      await RefreshToken.create({ token: refreshToken })
      res.json(refreshToken)
    } catch (error) {
      return next(error)
    }
  }
  async logout (req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required()
    })
    const { error } = refreshSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token })
    } catch (error) {
      return next(new Error('Something went wrong in the database'))
    }
    res.json({ status: 1 })
  }
}

module.exports = new LoginController()
