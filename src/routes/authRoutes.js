const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { passportCall } = require('../middlewares/auth');
const { upload } = require('../utils/utils');

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

authRouter.get('/perfil', passportCall("jwt") , authController.getPerfil);

authRouter.post('/:uid/foto', upload.fields([
  { name: "profilePicture", maxCount: 1 }
]), authController.postPhoto);

module.exports =  authRouter;