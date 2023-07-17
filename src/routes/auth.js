const express = require('express');
const authRouter = express.Router()
const passport = require('passport');

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
  
    const user = req.session.user;
  console.log(user)
    if (user.role !== 'admin' && user.role !== 'usuario') {
      return res.status(403).send('Acceso denegado');
    }
  
    next();
  };


authRouter.get('/register', (req, res) => {
  return res.render('register.handlebars', {});
});

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName};

  return res.json({ msg: 'ok', payload: req.user });
 //return res.redirect('/home');
});

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' });
});

authRouter.get('/login', (req, res) => {
  return res.render('login.handlebars', {});
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' });
  }
  req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name , role: req.user.role , age: req.user.age};
console.log( req.session.user)
return res.redirect('/home');
//return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' });
});

authRouter.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
    }
    return res.redirect('/login');
  });
});

authRouter.get('/perfil', requireLogin, (req, res) => {
  const user = req.session.user;
  console.log(user)
  return res.render('perfil.handlebars', { user: user });
});

module.exports =  authRouter;