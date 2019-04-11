const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy, ExtractJwt } = require("passport-jwt");

const Admin = require("../modules/admins/admin.model");

require("dotenv").config({ path: __dirname + "/.env.local" });

//local strategy
const localOpts = {
  usernameField: "email"
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return done(null, false);
      } else if (!admin.authenticateAdmin(password)) {
        return done(null, false);
      }
      return done(null, admin);
    } catch (e) {
      return done(e, false);
    }
  }
);

//jwt strategy
const jwtOpts = {
  // the jwt token will be in authorization header
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: "thisisalamesecret",
  ignoreExpiration: false
};

const jwtStrategy = new Strategy(jwtOpts, async (payload, done) => {
  try {
    const admin = await Admin.findById(payload._id);
    if (!admin) {
      return done(null, false);
    }
    return done(null, admin);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = {
  authLocal: passport.authenticate("local", { session: false }),
  authJwt: passport.authenticate("jwt", { session: false })
};
