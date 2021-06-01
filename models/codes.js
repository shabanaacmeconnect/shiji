const Joi = require('joi');


function validatecodes(Banks) {
  const schema = Joi.object( {
    code_id:Joi.number(),
    country: Joi.string().max(60).required(),
    code:Joi.string().max(4).required(),
  })
  return schema.validate(Banks);
}

exports.validatecodes = validatecodes;