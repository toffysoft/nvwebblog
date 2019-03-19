const {User} = require('../models')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
 }
 
 module.exports = {
  async register (req, res) {
    try {         
      const user = await User.create(req.body)
      res.send(user.toJSON())
      // res.send({
      //   user: userJson,
      //   token: jwtSignUser(userJson)
      // })
    } catch (error) {
      res.status(400).send({
        error: 'The content information was incorrect'
      })
    }
  },


  async clientLogin (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if(!user) {
        return res.status(403).send({
          error: 'User/Password not correct'
        })
      }

      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'User/Password not correct'
        })
      }

      if(user.status != "active") {
        return res.status(403).send({
          error: 'Your account suspend.'
        })
      }

      // dont't check permission type
     
      const userJSON = user.toJSON()
      
      res.send({
        user: userJSON,
        token: jwtSignUser(userJSON)
      })
      
    } catch (error) {
      res.status(500).send({
        error: 'Error! from get user'
      })
    }
  },

  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email
          // password: password
          // status: 'active'
        }
      })

      if(!user) {
        return res.status(403).send({
          error: 'User/Password not correct'
        })
      }

      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'User/Password not correct'
        })
      }

      if(user.type != "admin") {
        return res.status(403).send({
          error: 'Permission not correct'
        })
      }

      if(user.status != "active") {
        return res.status(403).send({
          error: 'Your account suspend.'
        })
      }

      const userJSON = user.toJSON()
      
      res.send({
        user: userJSON,
        token: jwtSignUser(userJSON)
      })
      
    } catch (error) {
      res.status(500).send({
        error: 'Error! from get user'
      })
    }
  }
}