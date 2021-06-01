const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user =require('../models/user');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
const uuidAPIKey = require('uuid-apikey');
const CustomStrategy = require('passport-custom').Strategy;

var options={}
options.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey='terminalsecret1321';
passport.use('terminal', new CustomStrategy(
    function(req, callback) {
        const payload = {
            apiKey: '6PSDEWS-7EY439Z-QMX91HZ-RHDHTYV'
        }
        if(req.body.apiKey==payload.apiKey)
        return callback(null,payload)
        else return callback(null, false);
    }
  ));    
