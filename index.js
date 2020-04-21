// index.js
// This tutorial for design: https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
// This one for authorisation: https://auth0.com/blog/create-a-simple-and-secure-node-express-app/#Setting-Up-the-Project

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

var cookieParser = require('cookie-parser');
var logger = require('morgan');

require("dotenv").config();

const authRouter = require("./auth");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 * Session Configuration
 */

const session = {
    secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
    cookie: {},
    resave: false,
    saveUninitialized: false
};

if (app.get("env") === "production") {
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true;
}

/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
);

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//Custom middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

//Router mounting
app.use("/", authRouter);

/**
 * Routes Definitions
 */

 const secured = (req, res, next) => {
     if (req.user) {
         return next();
     }
     req.session.returnTo = req.originalUrl;
     res.redirect("/login");
 };

 app.get("/", (req, res) => {
     res.render("index", {title: "Home"});
 });

app.use('/users', usersRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Server Activation
 */

 app.listen(port, () => {
     console.log(`Listening to requests on http://localhost:${port}`);
 });