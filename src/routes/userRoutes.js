const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { passportCall, authorization } = require("../middlewares/auth");
const { upload } = require("../utils/utils");

// Ruta protegida con JWT y verificación de rol de administrador
userRouter.post(
  "/premium/:uid",
  passportCall("jwt"),
  userController.userChange
);

// Ruta para mostrar el formulario de carga de documentos
userRouter.get("/:uid/documents/upload", userController.userRenderUpload);

// Ruta para cargar documentos usando Multer
userRouter.post(
  "/:uid/documents",
  upload.fields([
    { name: "identification", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  userController.uploadDocuments
);

userRouter.get(
  "/users",
  passportCall("jwt"),
  authorization("admin"),
  userController.getAllUsers
);

userRouter.post(
  "/changeRole",
  passportCall("jwt"),
  authorization("admin"),
  userController.userChangeAdmin
);

userRouter.post(
  "/deleteUser",
  passportCall("jwt"),
  authorization("admin"),
  userController.deleteUser
);

userRouter.post(
  "/deleteManyUsers",
  passportCall("jwt"),
  authorization("admin"),
  userController.deleteLastConnection
);

module.exports = userRouter;
