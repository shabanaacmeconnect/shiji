const mysql = require('mysql');
var path = require("path");
 var env = process.env.NODE_ENV || "production";
// var env = "development"
var config = require(path.join(__dirname, "..", "config", "config.json"))[env];
const fs=require('fs');
const dbconfig={
  supportBigNumbers: true,
  bigNumberStrings: true,
  connectionLimit: 10,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    waitForConnections: true, 
//   ssl  : {
//     ca : fs.readFileSync(__dirname + '/ca-certificate.crt')
// },
  host:config.host,
  user:config.username,
  password:config.password,
  database:config.database,
  port:config.port
  // port     : process.env['MYSQL_PORT'],
  // host     : process.env['MYSQL_HOST'],
  // user     : process.env['MYSQL_USER'],
  // password : process.env['MYSQL_PASSWORD'],
  // database : process.env['MYSQL_DB']
};
const connection  = mysql.createConnection(dbconfig);
// connection.on('error', function(err) {
//   console.log('db error', err);
//   if(err.code ) {
//     const connection  = mysql.createConnection(dbconfig);
//   }else{
//       throw err;
//   }
// });

function executeQuerySelect (sql,params=[],callback=null) {
  connection.connect();

    connection.query(sql, params, function(err, results) {
      if(err) { 
        console.log(err); 
        if(callback)return callback(err,results); 
        return; 
      }
      return callback(err, results);
    });

};
function executeQueryInsert(sql,params=[],callback=null) {
 connection.connect()
    connection.query(sql, [params], function(err, results) {
      if(err) { 
        console.log(err); 
        if(callback)return callback(err,results); 
        return; 
      }
      return callback(err, results);
    });

  };
function executeQueryUpdate(sql,params,callback=null) {     
  connection.connect();
    connection.query(sql,params, function(err, results) {
      if(err) { 
        console.log(err); 
        if(callback)return callback(err,results); 
        return; 
      }
      return callback(err, results);
    });
};

exports.executeQuerySelect = executeQuerySelect;
exports.executeQueryInsert = executeQueryInsert;
exports.executeQueryUpdate = executeQueryUpdate;