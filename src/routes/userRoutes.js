const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { passportCall, authorizationLevel2 } = require('../middlewares/auth');

// Ruta protegida con JWT y verificación de rol de administrador
userRouter.post('/premium/:uid', passportCall('jwt'), userController.userChange );

module.exports = userRouter;