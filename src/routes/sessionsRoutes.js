const express = require("express");
const passport = require("passport");
const sessionRouter = express.Router();
const sessionController = require('../controllers/sessionsController');

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

sessionRouter.get(
  "/github/callback",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  sessionController.getGithubCall
);

sessionRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  sessionController.getCurrent
);

// Ruta de registro de usuarios
sessionRouter.post("/register", sessionController.postRegister);

// Ruta de login
sessionRouter.post("/login", sessionController.postLogin);

module.exports = sessionRouter;
