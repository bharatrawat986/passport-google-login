const express = require('express')
const app = express()
const port = 3000;

const session = require('express-session');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla'
}));

require('dotenv').config();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:3000/oauth2/redirect/google'
},
    function (issuer, profile, cb) {
        console.log(issuer);
        console.log(profile);
        console.log(cb);
        console.log(profile.emails);
        return cb(null, profile);
    }
));


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/oauth2/redirect/google',
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureMessage: true,
        session: false
    }),
    function (req, res) {
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify(req.user));
        res.status(200).send(responseHTML);
    });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})