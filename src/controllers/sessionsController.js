const User = require("../dao/models/user");
const userDTO = require("../dao/DTOs/userDTO");
const jwt = require('jsonwebtoken'); 

const getGithubCall = async (req, res) => {

    const user = req.user;
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 


    req.session.user = {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      age: user.age,
    };

    res.redirect("/home");
  };

const getCurrent = (req, res) => {
    console.log({ user: req.user });
   let user = new userDTO(req.user)
   console.log(user);
    res.json( user );

  };

// Ruta de registro de usuarios
const postRegister = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("El usuario ya existe");
    }

    const user = new User({ first_name, last_name, email, age, password });
    await user.save();

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("user");
    console.log(user);

    if (!user || user.password !== password) {
      return res.status(401).send("Credenciales inválidas");
    }
    console.log("req.session");
    console.log(req.session);

    req.session.user = user;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user.role = "admin";
    }

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = {getGithubCall , getCurrent , postRegister , postLogin };
