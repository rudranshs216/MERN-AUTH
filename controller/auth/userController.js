const { default: User } = require("../../models/user")

class userController {
  async me (req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id })
      res.json(user)
    } catch (error) {
      return next(error)
    }
  }
}
module.exports = new userController()
