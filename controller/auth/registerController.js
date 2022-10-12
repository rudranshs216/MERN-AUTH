import Joi from 'joi'
import User from '../../models/user'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'
import RefreshToken from '../../models/refresh'

class registerController {
  async register (req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string()
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      cPassword: Joi.ref('password')
    })
    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    try {
      const exist = await User.exists({ email: req.body.email })
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist('This Email is already taken ')
        )
      }
    } catch (error) {
      return next(error)
    }

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    var accessToken, refreshToken
    try {
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      })
      console.log(user._id);

      accessToken = JwtService.sign({ _id: user._id, role: user.role })
      refreshToken = JwtService.sign({ _id: user._id, role: user.role }, '1y');

      await RefreshToken.create({token : refreshToken});
    } catch (error) {
      return next(error)
    }

    res.json({ accessToken, refreshToken })
  }
}

module.exports = new registerController()
