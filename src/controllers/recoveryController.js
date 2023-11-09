const { sendEmailrecovery }  = require('./../controllers/emailController')
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require("../utils/utils");
const User = require("../dao/models/user");

const secretKey = 'secretRecovery'; 
const tokenDuration = '1h'; 


const requestRecovery = (req, res) => {
  const { email } = req.body; 

  const token = jwt.sign({ email }, secretKey, { expiresIn: tokenDuration });

  sendEmailrecovery(token, email)

  res.status(200).send('Token de recuperación enviado por correo.');
};

// Endpoint para restablecer la contraseña con el token JWT
const verifyReset = (req, res) => {
  const token = req.params.token;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
//      return res.status(400).send('Token no válido o expirado.');
     return  res.render('recoveryExpired');
     }

    const email = decoded.email//.toObject({ getters: true });
    const token2 = token//.toObject({ getters: true });

    res.render('recoveryPassword', { email, token: token2 });
  });
};

// Endpoint para procesar el restablecimiento de contraseña
const processReset =  (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;

  jwt.verify(token, secretKey, async (err, decoded) => {

    if (err) {
     return res.render('recoveryExpired'); 
      //return res.status(400).send('Token no válido o expirado.');
    }

    const email = decoded.email;
    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log("User Not Found with username (email) " + email);
      return res.status(400).send("User Not Found");
    }
    if (isValidPassword( newPassword, user.password)) {
      console.log("Invalid Password");
      return res.render('recoveryPassword', { email, token,message:"Colocar una contraseña diferente a la anterior" });
    }
    console.log("user");
    console.log(user);

   user.password = createHash(newPassword)

   user.save()

  //  res.status(200).send('Contraseña restablecida con éxito.');
  res.render('resetSucces');
});
};

const renderRequestRecovery = (req, res) => {
  
    res.render('requestRecovery.handlebars');
  };
  
module.exports = { renderRequestRecovery ,requestRecovery, verifyReset, processReset };