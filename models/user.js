const {executeQuerySelect, executeQueryInsert,executeQueryUpdate}= require('../shared/shared-db');
const Joi = require('joi');


function validateUser(user) {
  const schema = Joi.object( {
    user_id:Joi.number(),
    name: Joi.string().min(2).max(60).required(),
    role:Joi.string().required(),
    password:Joi.string().min(6).max(50),
    email: Joi.string().min(2).max(60).required(),

  });

  return schema.validate(user);
}

let User={
    signup:(input,cb)=>{
       return  executeQueryInsert('INSERT INTO `user`( `name`,`email`,`password`,`role`) VALUES ? ',
  [[input.name,input.email,input.password,input.role]],cb)
    },
    findOne:(input,cb)=>{
        return executeQuerySelect('SELECT * from  user  where deleted !=1 and email=?',[input],cb)
    },
    findById:(input,cb)=>{
        return executeQuerySelect('SELECT * from  user  where deleted !=1 and user_id=?',[input],cb)
    }
}

exports.User = User;
exports.validateUser = validateUser;