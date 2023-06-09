const express= require('express')
const User = require('../models/user-model')
const Job = require('../models/job-model')
const router = express.Router()
const authCheck= require('../middleware/authCheck')
const profileCheck =require('../middleware/profileCheck')
const otpCheck = require('../middleware/otpCheck')
const mongoose = require('mongoose')
const numberCheck = require('../middleware/numberCheck')

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/user-worker' ,authCheck, numberCheck, async (req,res)=>{
     const user = await User.findOne({googleID : req.user.googleID})
     user.email=req.body.email
     user.address=req.body.address
     user.contact1=req.body.contact1
     if(req.body.contact2)
     user.contact2=req.body.contact2
     user.type="worker"
     user.profileComplete=true
     user.verified=false
     const jobs = ['Painter','Gardener','Maid','Watchman']
     jobs.forEach((job)=>{
         if((job in req.body) && !user.jobTypes.includes(job)) user.jobTypes.push(job)
     })
     
     req.user=user
     await user.save()
    res.redirect('/users/profile')
})

router.post('/user-recruiter' ,authCheck, numberCheck, async (req,res)=>{
            console.log(req.user)
        const user = await User.findOne({googleID : req.user.googleID})
        user.email=req.body.email
        user.address=req.body.address
        user.contact1=req.body.contact1
        if(req.body.contact2)
        user.contact2=req.body.contact2
        user.type="recruiter"
        req.user=user
        user.profileComplete=true
        user.verified=false
        await user.save()
        res.redirect('/users/profile')
})

router.get('/about-us',(req,res)=>{    
    res.render('about-us',{user:req.user})
})
router.get('/users/profile/update' , authCheck,(req,res)=>{
    res.render('profile-form',{user:req.user})
})

router.get('/users/profile' , authCheck ,profileCheck, otpCheck ,(req,res)=>{


    
   res.render('profile',{user:req.user})
})

router.get('/users/jobs', authCheck , profileCheck , async (req,res)=>{
     const jobs = await Job.find({ownerID : req.user.googleID})    
     res.render('myjobs',{ user:req.user , jobs:jobs})
});

router.get('/users/dashboard', authCheck , profileCheck , async (req,res)=>{
    
    if(req.user.type == "worker"){
        const jobs = await Job.find({})
        const fitjobs= jobs.filter((job)=> {
            if (req.user.jobTypes.includes(job.jobType)) return true
            return false
        })
        res.render('dashboard',{ jobs:fitjobs ,user:req.user})
     }
     else if(req.user.type == "recruiter"){
        const users = await User.find({  type:'worker'})
        res.render('dashboard',{ users:users ,user:req.user})
     }else{
        const jobs = await Job.find({})
        const workers = await User.find({  type:'worker'})
        const recruiters = await User.find({  type:'recruiter'})
        res.render('dashboard',{ jobs:jobs,workers:workers, recruiters:recruiters ,user:req.user})
    }
});
router.post('/users/dashboard/filter',authCheck , profileCheck , async (req,res)=>{
    const filters = []
    for(var propt in req.body) {
        filters.push(propt)
    }
    if(req.user.type == "worker"){
        const jobs = await Job.find({})
        const fitjobs= jobs

        if(filters.length>0){
            const filteredjobs = fitjobs.filter((job)=> (filters.includes(job.jobType)))
            res.render('dashboard',{ jobs:filteredjobs ,user:req.user})
        }else{
            res.render('dashboard',{ jobs:jobs ,user:req.user})
        }
    }
    else if(req.user.type == "recruiter"){
        const users = await User.find({  type:'worker'})
        if(filters.length>0){
            const filterusers=users.filter((user)=>(filters.some((filter)=>  user.jobTypes.includes(filter))))
            res.render('dashboard',{ users:filterusers ,user:req.user})
        }else{
            res.render('dashboard',{ users:users ,user:req.user})
        }
    }
    else{
        console.log(filters)
        const jobs = await Job.find({})
        const workers = await User.find({  type:'worker'})
        const recruiters = await User.find({  type:'recruiter'})
        if(filters.length>0){
            const s = filters[0]
            if(s[s.length-1]=='J'){
                const newfilters=[];
                newfilters.push(s.slice(0,s.length-1))
                console.log(newfilters,1)
                const filterjobs=jobs.filter((job)=>(newfilters.some((filter)=>  job.jobType.includes(filter))))
                res.render('dashboard',{ jobs:filterjobs,workers:workers,recruiters:recruiters ,user:req.user})
            }else{
                const newfilters=[];
                newfilters.push(s.slice(0,s.length-1))
                console.log(newfilters,2)
                const filterworkers=workers.filter((user)=>(filters.some((filter)=>  user.jobTypes.includes(filter))))
                res.render('dashboard',{ jobs:jobs,workers:filterworkers,recruiters:recruiters ,user:req.user})
            }
        }else{
            res.render('dashboard',{ jobs:jobs,workers:workers,recruiters:recruiters ,user:req.user})
        }

     }

})

router.get('/users/newjobs',authCheck ,(req,res)=>{
    res.render('job-form', {user:req.user})
})


router.get('/users/recruiter',authCheck ,async (req,res)=>{
    console.log("users route")
    const users = await User.find({type:'recruiter'})
    res.send(users)
})


router.post('/users/delete',authCheck ,async (req,res)=>{
    try{
        await User.findOneAndDelete( { _id: mongoose.Types.ObjectId(req.body._id) } )
      }
      catch(err){
         console.log(err);
      }
      res.redirect('/users/dashboard')
})

module.exports=router