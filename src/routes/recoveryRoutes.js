const express = require('express');
const recoveryRouter = express.Router();
const recoveryController = require('../controllers/recoveryController');


recoveryRouter.get('/', recoveryController.renderRequestRecovery );

recoveryRouter.post('/request', recoveryController.requestRecovery );

recoveryRouter.get('/reset/:token', recoveryController.verifyReset );

recoveryRouter.post('/reset/:token', recoveryController.processReset );

module.exports = recoveryRouter;
