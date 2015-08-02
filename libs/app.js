var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var methodOverride = require('method-override');
var restful = require('node-restful');
var flash    = require('connect-flash');
var session      = require('express-session');
var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');
var authUser  = require(libs + 'auth/user');
var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');
var api = require('./routes/api');
var users = require('./routes/users');
var clients = require('./routes/clients');
var httpProxy = require('http-proxy');
var apiProxy = new httpProxy.createProxyServer();
var app = express();

//Allow CORS for Swagger UI testing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/static', express.static('public'));
// app.use('/', api);
// app.use('/api', api);
//API PROXY

//Resource Gateway
var goResourceService=function (req, res, next) { 
  apiProxy.web(req, res, { target: 'http://localhost:1338' });
}
app.get('/api/v1/me', goResourceService);
app.get('/api/v1/members', goResourceService);


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(cookieParser());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/api/v1/clients',clients);


//Authorize Gateway

 //get accessToken by HeHa username and password (in req.body.username, req.body.password)
app.use('/api/v1/oauth/token',[function(req, res, next) {
    authUser.registerOrLogin(req, res, next); 
},oauth2.token]);  
//use refreshToken to get an new accessToken
app.use('/api/v1/oauth/refresh',oauth2.token);  
// catch 404 and forward to error handler
app.use(function(req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
        error: 'Not found' 
    });
    return;
});
module.exports = app;

//register or login to HeHa (For future Web login VIA 3RD PARTY)
/*
app.get('/auth/weibo', passport.authenticate('sina', { scope : ['profile', 'email'] }));

app.get('/auth/weibo/callback',
    passport.authorize('sina'),function(req, res){
        console.log("xxx");
        app.use(oauth2.token);
        //Not yet ready
        //mobile app use weibo SDK then pass profile value to gateway.
    });
app.get('/connect/weibo', passport.authorize('sina', { scope : ['profile', 'email'] }));

// the callback after weibo has authorized the user
app.get('/connect/weibo/callback',
    passport.authorize('sina', {
        successRedirect : '/profile',
        failureRedirect : '/fail'
    }));
// app.get('/unlink/weibo', isLoggedIn, function(req, res) {
//     var user          = req.user;
//     user.weibo.token = undefined;
//     user.save(function(err) {
//         res.redirect('/profile');
//     });
// });
*/

