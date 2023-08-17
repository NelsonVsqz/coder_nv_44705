const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const Cart = require('../dao/models/carts');

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
 passport.authenticate('register', { failureRedirect: '/auth/failregister' })(req, res, async () => {
  if (!req.user) {
    return res.json({ error: 'something went wrong' });
  }
console.log(req.user)
console.log("req.user")

try {
  const carts = await Cart.find({});
  const cartId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
  const newCart = new Cart({
    id: cartId,
    products: [],
  });

  await newCart.save();

     req.user.cart = newCart._id;
    await req.user.save();
  req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName};

//  res.json({ msg: 'ok', payload: req.user });
  //return res.json({ msg: 'ok', payload: req.user });
  return res.redirect('/home');
 
} catch (error) {
    console.error(error);
    return res.json({ error: 'something went wrong' });
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
        return next(error);
      }
    })(req, res, next);
  };



const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'no se pudo cerrar su sesión' });
      }
      return res.redirect('/login');
    });
  };
  
const getPerfil = (req, res) => {
    const user = req.session.user;
    console.log(user);
    return res.render('perfil.handlebars', { user: user });
  };

module.exports =  { requireLogin , login , logout , getPerfil , register }