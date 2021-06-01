const express = require('express');
const passport = require('passport');
const bcrypter=require('bcrypt');
const user =require('../models/user');
const jwt= require('jsonwebtoken')
const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup',function(req,res){
    const password=req.body.password;
    const saltround=10;
    data={};
    bcrypter.hash(password,saltround,function(err,result){
        req.body.password=result;
        data=req.body;
        user.User.signup(data,function(err,response){
            if(err) res.status(400).send({status:false,data:err,message:"faliled"})
            res.status(200).send({status:true,data:response,message:"Success"})

        })
    })
});

router.post('/login',function(req,res,next){
    passport.authenticate('local',{session:false},function(err,result,info){
        if(err) return next(err);
        if(!result) return res.send({status:false,data:result,message:info.message})
        const payload={
            name:result.name,
            user_id:result.user_id,
            role:result.role
        }
        const token=jwt.sign(payload,'secretpos');
        res.send({status:true,data:token,message:'success'})
    })(req,res,next)
})
module.exports = router;