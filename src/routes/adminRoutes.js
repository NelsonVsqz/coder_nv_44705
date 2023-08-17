// routes/admin.js
const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const { passportCall, authorization } = require('../middlewares/auth');

// Ruta protegida con JWT y verificación de rol de administrador
adminRouter.get('/', passportCall('jwt'), authorization('admin'), adminController.getAdminPage );

module.exports = adminRouter;
