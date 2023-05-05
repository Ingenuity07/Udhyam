const router = require('express').Router();
const passport =require('passport')
const User = require('../models/user-model')
const otpCheck = require('../middleware/otpCheck')
const {startVerification,verifyOTP} = require('../utils/verify')
router.get('/login',(req,res)=>{
    res.render('login',{user:req.user});
})

router.get('/admin-login',(req,res)=>{
    res.render('admin-login',{user:req.user});
})

router.get('/signup',(req,res)=>{
    res.render('signup',{user:req.user});
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

router.get('/google', passport.authenticate(
    'google' ,{
        scope : ['profile' , 'email']
    }
))

router.get('/google/redirect', passport.authenticate('google') ,(req,res)=>{
    res.redirect('/users/profile')
})

router.post('/local-login',passport.authenticate('local',{failureRedirect:"/auth/login",successRedirect:"/users/profile"}),async (req, res)=>{ 
    
})

router.post('/otp',async (req,res)=>{
    
        // console.log(req.body)
        startVerification(req.body.contact1)
        .then((success)=>console.log('success'))
        .then(()=>res.render('otp',{context: req.body}))
        .catch((er)=>{ 
        console.log("Errroorororo",er)
        res.render('error',{message: "Enter valid Phone Number"})})
})

router.post('/verify-otp',async (req,res)=>{
     verifyOTP(req.body.contact1, req.body.otp)
    .then(async ()=>{
        req.body={...req.body,verified:true}
        console.log(req.body)
        if(!req.user){
            const user =  await User.findOne({contact1: req.body.contact1})
            if(user) return res.render('error',{message: "User already registered"})
            
            await User.create(req.body)
            res.redirect(307,'/auth/local-login')
            return
        }
        const user = await User.findOne({googleID : req.user.googleID})
        user.verified=true
        await user.save()
        res.redirect('/users/profile')
    })
    .catch(()=>res.render('error',{message: "Invalid OTP - Please retry"}))
})

module.exports = router;