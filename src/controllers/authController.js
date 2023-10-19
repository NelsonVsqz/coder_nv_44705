const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const Cart = require('../dao/models/carts');
const User = require("../dao/models/user");

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
  
    const user = req.session.user;
  console.log(user)
    if (user.role !== 'admin' && user.role !== 'usuario') {
      return res.status(403).send('Acceso denegado');
    }
  
    next();
  };


const register = (req, res, next) => {
 passport.authenticate('register',async (err, user) => {
  
  if (err) {
    console.error("Error register controller viene de /authservices");    
    //console.error(err);
    return next(err);
} 

console.log("user")
console.log(user)

try {
  const carts = await Cart.find({});
  const cartId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
  const newCart = new Cart({
    id: cartId,
    products: [],
  });

  await newCart.save();

     user.cart = newCart._id;
    await user.save();
  req.session.user = { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName , cart: user.cart};

  return res.redirect('/');
 
} catch (error) {
     console.log("Error register controller catch")  
     //console.log(error)
     return next(error);
  }

})(req, res, next);
};



const login = (req, res, next) => {
    passport.authenticate('login', { failureRedirect: '/auth/faillogin' }, async (err, user, info) => {
      try {
        if (err || !user) {
          return res.json({ error: 'invalid credentials' });
        }
        
        console.log("req.user");
        console.log(user);
        console.log(info);
  
        // Generar el token utilizando jsonwebtoken y almacenarlo en una cookie
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // La cookie expirará en 1 hora
  
        // Devolver la información del usuario
        req.session.user = {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          age: user.age,
        };
        
        console.log("token");
        console.log(token);
  
        return res.redirect('/home');
      } catch (error) {
        console.log(error)
        return next(error);
      }
    })(req, res, next);
  };



const logout = async (req, res) => {
  const uid =  req.session.user._id ;
  const user = await User.findOne({ _id: uid })
  user.last_connection = new Date();
  user.save()
  req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'no se pudo cerrar su sesión' });
      }
      return res.redirect('/login');
    });
  };
  
const getPerfil = async (req, res) => {
    const user2 = req.session.user;
    const uid =  req.session.user._id ;
    const user1 = await User.findOne({ _id: uid })  
    const user = user1.toObject({ getters: true })   

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Verifica si el usuario ya ha cargado documentos específicos
    const hasPhotoProfile = userHasDocument(user.documents, "profilePicture");
    if (hasPhotoProfile) {
    const photo = user.documents.filter(x => x.name == "profilePicture")[0].reference 

    const rutaConvertida = photo.replace(/\\/g, '/');

    const posicion = rutaConvertida.indexOf('profiles/');

    const rutaCortada = "/"+rutaConvertida.slice(posicion);
    console.log(rutaCortada)
    return res.render('perfil.handlebars', { user , uid , hasPhotoProfile , rutaCortada });
    }
    return res.render('perfil.handlebars', { user , uid , hasPhotoProfile });
  };

  const postPhoto = async (req, res) => {
    const uid = req.params.uid;
    const user = await User.findOne({ _id: uid });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Verificar si el usuario ya ha cargado documentos específicos
    const hasProfilePicture = userHasDocument(user.documents, "profilePicture");

    console.log("req")
    console.log(req.files)
    console.log(Object.entries(req.files))        

    const filesArray = Object.entries(req.files) 
    // Verificar si los campos de carga están presentes en la solicitud y el usuario aún no ha cargado esos documentos
    if (filesArray && filesArray.length > 0) {
        if (!hasProfilePicture && filesArray.some(file => file[0] === "profilePicture")) {
            console.log(filesArray.find(file => file[0] === "profilePicture")[1][0])
            user.documents.push({
                name: "profilePicture",
                reference: filesArray.find(file => file[0] === "profilePicture")[1][0].path
            });
        }

        // Guardar los documentos actualizados en el usuario
        user.save();
        console.log("user uploadPhoto save")
        console.log(user)
        res.status(200).json({ message: "Foto cargado con éxito" });
    } else {
        res.status(400).json({ message: "No se proporciono foto para cargar" });
    }
};


  function userHasDocument(documents, name) {
    return documents.some(doc => doc.name === name);
}  

module.exports =  { requireLogin , login , logout , getPerfil , register, postPhoto }