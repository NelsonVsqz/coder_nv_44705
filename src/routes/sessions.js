const express = require('express');
const router = express.Router();
const User = require('../dao/models/user');

// Ruta de registro de usuarios
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).send('El usuario ya existe');
      }
  
      const user = new User({ first_name, last_name, email, age, password });
      await user.save();
  
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });
  
  // Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log("user")
      console.log(user)
  
      if (!user || user.password !== password) {
        return res.status(401).send('Credenciales inválidas');
      }
      console.log("req.session")
      console.log(req.session)
  
      req.session.user = user;

      if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user.role = 'admin';
      }      
  
      res.redirect('/home');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

  module.exports = router;