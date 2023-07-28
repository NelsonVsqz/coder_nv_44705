// routes/admin.js
const express = require('express');
const adminRouter = express.Router();
const { passportCall, authorization } = require('../middlewares/auth');

// Ruta protegida con JWT y verificación de rol de administrador
adminRouter.get('/', passportCall('jwt'), authorization('admin'), (req, res) => {
  // req.user contiene la información del usuario autenticado con JWT
  const user = req.user.toObject({ getters: true });

  res.render('admin.handlebars', { user: user });
});

module.exports = adminRouter;
