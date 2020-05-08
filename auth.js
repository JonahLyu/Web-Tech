// auth.js
//Vital to read this: https://auth0.com/blog/create-a-simple-and-secure-node-express-app/#Setting-Up-the-Project

/**
 * Required External Modules
 */

// const {app, session, redis, redisStore, client, bodyParser} = require("./index.js");

const express = require("express");
// const expressSession = require("express-session");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");

require("dotenv").config();

/**
 * Routes Definitions
 */

router.get(
    "/login",
    passport.authenticate("auth0", {
        scope: "openid email profile"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            const { _raw, _json, ...userProfile } = req.user;
            req.session.user = userProfile.id;
            res.redirect(returnTo || "/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
          process.env.NODE_ENV === "production"
            ? `${returnTo}/`
            : `${returnTo}:${port}/`;
    }

    const logoutURL = new URL(
        util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
    );
    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});

/**
 * Module Exports
 */

module.exports = router;
