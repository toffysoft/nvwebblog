const UserController = require('./controllers/UserController')
const UserAuthenController = require('./controllers/UserAuthenController')

module.exports = (app) => {
  // authen
  app.post('/login', 
      UserAuthenController.login
  )

  // users
  // create user
  app.post('/user',
    UserController.create
  )

  // edit user, suspend, active
  app.put('/user/:userId',
    UserController.put
  )

  // delete user
  app.delete('/user/:userId',
    UserController.remove
  )

  // get user by id
  app.get('/user/:userId',
    UserController.show
  )

  // get all user
  app.get('/users',
    UserController.index  
  )
}
