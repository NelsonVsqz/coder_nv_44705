// middlewares/auth.js
const passport = require('passport');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const passportCall = (st) => {
  return async (req, res, next) => {
    passport.authenticate(st, function (err, user, info) {
      console.log(info);
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (role) => {
  return async (req, res, next) => {

    if (!req.user) return res.status(401).send({ error: 'unauthorized' });
    if (req.user.role !== role) return res.status(403).send({ error: 'no permissions' });
    next();
  };
};


module.exports = { cookieExtractor, passportCall, authorization };
