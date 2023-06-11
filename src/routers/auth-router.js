const router = require('express').Router();
const passport =require('passport')
const User = require('../models/user-model')
const otpCheck = require('../middleware/otpCheck')
const {startVerification,verifyOTP} = require('../utils/verify');
const numberCheck = require('../middleware/numberCheck');
router.get('/login',(req,res)=>{
    res.render('login',{message:""});
})

router.get('/admin-login',(req,res)=>{                // Route for admin login
    res.render('admin-login',{message:""});
})

router.get('/signup',(req,res)=>{                     // Route for registering new user
    res.render('signup',{user:req.user});
})

router.get('/logout',(req,res)=>{                     // Route for logging out current user
    req.logout();
    res.redirect('/');
})

router.get('/google', passport.authenticate(          // Google Authentication login route
    'google' ,{
        scope : ['profile' , 'email']
    }
))

router.get('/google/redirect', passport.authenticate('google') ,(req,res)=>{          // Redirect route when google auth completes
    res.redirect('/users/profile')
})

router.post('/local-login',passport.authenticate('local',{failureRedirect:"/auth/login",successRedirect:"/users/profile"}),async (req, res)=>{ 
    
})
router.post('/admin-local-login',passport.authenticate('local',{failureRedirect:"/auth/admin-login",successRedirect:"/users/profile"}),async (req, res)=>{ 
    
})

router.post('/otp',numberCheck, async (req,res)=>{
    
        // console.log(req.body)
        startVerification(req.body.contact1)
        .then((success)=>console.log('success'))
        .then(()=>res.render('otp',{context: req.body}))
        .catch((er)=>{ 
        console.log(er)
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