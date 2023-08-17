const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');



authRouter.get('/register', (req, res) => {
  return res.render('register.handlebars', {});
});

authRouter.post('/register', authController.register);

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'fail to register' });
});

authRouter.get('/login', (req, res) => {
  return res.render('login.handlebars', {});
});

authRouter.post('/login', authController.login);



authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' });
});

authRouter.post('/logout', authController.logout);

authRouter.get('/perfil', authController.requireLogin, authController.getPerfil);

module.exports =  authRouter;