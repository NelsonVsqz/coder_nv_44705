const passport = require('passport');
const local = require('passport-local');
const { createHash, isValidPassword } = require('../utils/utils') ;
const User = require('../dao/models/user');
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { cookieExtractor } = require('../middlewares/auth'); 

const dotenv = require('dotenv');
dotenv.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const LocalStrategy = local.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: "secretKey",
};

const iniPassport = () => {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req,username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }
        console.log("user")
        console.log(user)

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, first_name, last_name , age } = req.body;
          let user = await User.findOne({ email: username });
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }

          const newUser = {
            email,
            first_name,
            age,
            last_name,
            password: createHash(password)
          };
          let userCreated = await User.create(newUser);
          console.log(userCreated);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/github/callback',
        scope: ['user:email']
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          console.log("profile")
          console.log(profile)
          console.log(profile.emails)
          console.log(profile.emails[0].value)
//          let user = await User.findOne({ email: profile.email });
          let user = await User.findOne({ email: profile.emails[0].value }); 
          if (!user) {
            const newUser = {
              email: profile.email,
              first_name: profile._json.name || profile._json.login || 'noname',
              age: 25,
              last_name: 'nolast',
              password: 'nopass',
            };
            let userCreated = await User.create(newUser);
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );



  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
  });
}

module.exports = iniPassport
