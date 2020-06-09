/**
 * Required External Modules
 */

const express = require("express");
const helmet = require('helmet');
const path = require("path");
var fs = require('fs')
var https = require('https')

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const redis = require('redis');
const redisStore = require('connect-redis')(expressSession);
const client = redis.createClient({
    host:'redis',
    port: 6379
});

const bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

require("dotenv").config();

const authRouter = require("./auth");

var usersRouter = require('./routes/users');
var forumRouter = require('./routes/forum');

/**
 * App Variables
 */

const app = express();
app.use(helmet());
const port = process.env.PORT || "8000";
const httpsPort = "8443"

/**
 * Session Configuration
 */

const session = {
    secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
    cookie: {},
    store: new redisStore({host:'redis', port:6379, client:client, ttl:260}),
    resave: false,
    saveUninitialized: false
};

/**
 * Disable browser caching
 */

app.set('etag', false);

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

/**
 *
 */

app.locals.pretty = true;
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
        process.env.AUTH0_CALLBACK_URL || "http://localhost:8000/callback" || "https://localhost:8000/callback"
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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery.cookie'));
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

 app.get("/", secured, (req, res) => {
     res.redirect("/forum/home");
 });

 

app.use('/users', usersRouter);
app.use('/forum', forumRouter);

app.get('*', function(req, res){
  res.status(404);
  res.render('error', {title: "Error", error: "Can not find a page"});
});

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
    console.log(`Http server listening to requests on http://localhost:${port}`);
});

https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app)
.listen(httpsPort, function () {
  console.log(`Https server listening to requests on https://localhost:${httpsPort}`)
})

 module.exports = {
     app,
     session,
     redis,
     redisStore,
     client,
     bodyParser
 }
