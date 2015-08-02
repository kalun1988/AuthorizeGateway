var faker = require('faker');

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var config = require(libs + 'config');

// var Config = require(libs + 'model/config');
var User = require('heha-gateway-model')('user');
var Client = require('heha-gateway-model')('client');
var AccessToken = require('heha-gateway-model')('accessToken');
var RefreshToken = require('heha-gateway-model')('refreshToken');

    // var config = new Config({ 
    //     social: "test"
    // });
    // config.save(function(err, user) {
    //     if(!err) {
    //         // log.info("New config - %s:%s", user.username, user.password);
    //     }else {
    //         return log.error(err);
    //     }
    // });
User.remove({}, function(err) {
    var user = new User({ 
        username: config.get("default:user:username"), 
        password: config.get("default:user:password"),
        social: config.get("default:user:social")
    });
    
    user.save(function(err, user) {
        if(!err) {
            log.info("New user - %s:%s", user.username, user.password);
        }else {
            return log.error(err);
        }
    });
});

Client.remove({}, function(err) {
    var client = new Client({ 
        name: config.get("default:client:name"), 
        clientId: config.get("default:client:clientId"), 
        clientSecret: config.get("default:client:clientSecret") 
    });
    
    client.save(function(err, client) {

        if(!err) {
            log.info("New client - %s:%s", client.clientId, client.clientSecret);
        } else {
            return log.error(err);
        }

    });
});

AccessToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

RefreshToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

setTimeout(function() {
    db.disconnect();
}, 3000);