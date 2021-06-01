const winston = require('winston');
require('express-async-errors');


module.exports = function() {
  process.on('uncaughtException', (ex) => {
    console.log('a')
  });
  process.on('unhandledRejection', (ex) => {
    console.log('a')

  });
  
  winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  
  winston.add(winston.transports.File, { filename: 'logfile.log' });
 
}