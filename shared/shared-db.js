const mysql = require('mysql');
var path = require("path");
 var env = process.env.NODE_ENV || "production";
var config = require(path.join(__dirname, "..", "config", "config.json"))[env];
const fs=require('fs');
const dbconfig={
  supportBigNumbers: true,
  bigNumberStrings: true,
  connectionLimit: 50,
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
var pool  = mysql.createPool(dbconfig);
// connection.on('error', function(err) {
//   console.log('db error', err);
//   if(err.code ) {
//      connection  = mysql.createConnection(dbconfig);
//   }else{
//       throw err;
//   }
// });

function executeQuerySelect (sql,params=[],callback=null) {
  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err)
      connection.release();
      callback(null, err);
      throw err;
    }   
   let q= connection.query(sql, params, function(err, results) {
      if(err) { 
        if(callback) return callback(err,results); 
        return; 
      }
      return callback(null, results);
    });
    console.log(q.sql)
    connection.release();
  })
 
};
function executeQueryInsert(sql,params=[],callback=null) {
  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      callback(null, err);
      throw err;
     }
    connection.query(sql, [params], function(err, results) {
      if(err) { 
        if(callback)return callback(err,results); 
        return; 
      }

      return callback(null, results);
    });
    connection.release();

  })
};
// function executeQuerySelect(sql, params = [], callback = null) {
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       connection.release();
//       callback(null, err);
//       throw err;
//      }
//     let selectQuery = connection.query(sql, params, function (err, results) {
//       if (err) {
//         if (callback) return callback(err, results);
//         return;
//       }
//       return callback(err, results, selectQuery);
//     });
//     connection.release();
//   });
// };
function executeQueryUpdate(sql,params,callback=null) {  
  pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      callback(null, err);
      throw err;
    }     
  connection.query(sql,params, function(err, results) {
  
      if(err) { 
        if(callback)return callback(err,results); 
        return; 
      }

      return callback(null, results);
    });
    connection.release();

  })
};

exports.executeQuerySelect = executeQuerySelect;
exports.executeQueryInsert = executeQueryInsert;
exports.executeQueryUpdate = executeQueryUpdate;