const express = require('express');
const router = express.Router();
const Joi = require('joi');
const crypto = require('crypto');

var request=require('request').defaults({ encoding: null });;

const {executeQuerySelect, executeQueryInsert,executeQueryUpdate}= require('../shared/shared-db');

  router.post('/requestQR', (req, res) => {

      const { error } = Joi.object({
        terId: Joi.string().required(),
        txnAmt: Joi.string().required(),
        totalAmt: Joi.string().required(),
        merid:Joi.string().required(),
        txnType:Joi.string().required(),
        merRef:Joi.string().required(),
        paymentMethod:Joi.string().required(),
        guestNo:Joi.string().required()  }).validate(req.body);

    if (error) return res.status(400).send({ status: false, data: error.details[0].message, message: "failed" })
    let body=[req.body.merRef,req.body.terId,req.body.txnType,'A0',req.body.paymentMethod, req.body.txnAmt,req.body.totalAmt,'840',req.body.guestNo]
    var query=executeQueryInsert('INSERT INTO `transactions`( `merRef` ,terId,`txnType`,issuerCode,paymentMethod,txnAmt,totalAmt,txnCurrCode,guestNo) values ?',
    [body],
    function(err1, result1) {
      if (err1) return res.status(500).send({status : false,data: err1,message:"failed"});
      let currenttime=formatDate()
      let hashstring='Marshal_APIUSER|AFGCPROE3OWPIART|'+result1.insertId+'|'+currenttime+'|'+req.body.merid+'|'+req.body.txnType+'|'+req.body.txnAmt+'|'+req.body.totalAmt+'|'
      let hash = crypto.createHash('sha512');
      hash.update(hashstring);
      const sigCheck = hash.digest('base64');
      return request({
        uri: 'https://png-dev-api-eu.shijicloud.com/sps-cloud-api/sps-cloud-api/v1/payment',
        method:"post",
        headers: { 'Content-Type': 'application/json' },
        json: {
          "type":"0",
          "apiUser":"Marshal_APIUSER",
          "merId":req.body.merid,
          "terId":req.body.terId,
          "txnType":req.body.txnType,
          "merRef":req.body.merRef,
          "reqTrace":result1.insertId,
          "issuerCode":"A0",
          "paymentMethod":req.body.paymentMethod,
          "txnAmt":req.body.txnAmt,
          "txnCurrCode":"840",
          "totalAmt":req.body.totalAmt,
          "guestNo":req.body.guestNo,
          "signature":sigCheck,
          "reqDatetime":currenttime
        }
    }, function (error, response, content) {
        if (error) {
            res.status(400).send({status:false,data:'',message:error})
        }
        else {
          let updateddata={txnNo:content.transaction.txnNo,respCode:content.respCode,response:JSON.stringify(content)}
          var query=executeQueryUpdate('UPDATE `transactions` SET ? where `reqTrace`=?',
          [updateddata,result1.insertId],  function(err2, result2) {
            if (err1) return res.status(500).send({status : false,data: err2,message:"failed"});
            return res.send({
              status: true,        
              respCode: content.respCode,
              respText: content.respText,
              txnNo: content.transaction.txnNo,
              qrAddress: content.transaction.qrAddress,
              message: content.respCode=='00'?"success":'Failed'
            });
          })
       
        }
    
      });
    })
       
 
});
module.exports = router;
function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    hour=d.getHours();
    minute=d.getMinutes();
    sec=d.getSeconds()
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return year+month+day+hour+minute+sec;
}
