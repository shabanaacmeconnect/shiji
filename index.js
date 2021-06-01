const Joi = require('joi');
require('dotenv').config();
const express = require('express');
const app = express();
const path=require("path");
app.use('/uploads', express.static(path.join(__dirname, './uploads')))
var bodyParser = require('body-parser');
const winston = require('winston'), createLogger = winston.createLogger, format = winston.format, transports = winston.transports;
var combine = format.combine, timestamp = format.timestamp, label = format.label, printf = format.printf;
require('./shared/passport');
const passport=require('passport');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session()); 
const api = require('./routes/api');
app.use(express.json());
app.use('/api',api);
// const authRouter =require('./routes/authenticate');
// app.use('/auth',authRouter);
// app.use('/admin', passport.authenticate('jwt', { session : false}),  adminRouter);
var myFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    return timestamp + " [" + label + "] " + level + ": " + message;
});
const logger = winston.createLogger({
    level: 'info',
    format: combine(label({ label: "api" }), timestamp(), myFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
passport.deserializeUser(function(id, done){
   return done(null,id)
});
passport.serializeUser(function(user, done){
    done(null,user.apiKey);
});

process.on('uncaughtException', (ex) => {
    logger.error(ex)
 });
process.on('unhandledRejection', (ex) => {
    logger.error(ex)
});

const port = process.env.PORT || 8074;
app.listen(port, () => console.log(`Listening on port ${port}...`));