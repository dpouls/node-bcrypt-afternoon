require('dotenv').config()
const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      app = express(),
      port = 4000,
      {SESSION_SECRET, CONNECTION_STRING} = process.env,
      authCtrl = require('./controllers/authController')
      treasureCtrl = require('./controllers/treasureController'),
      auth = require('./middleware/authMiddleware')



app.use(express.json())

massive(CONNECTION_STRING).then(db =>{
    app.set('db', db);
    console.log('db connected')
})

app.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET,
    })
  );

app.listen(port, () => console.log('server up'))

//endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
