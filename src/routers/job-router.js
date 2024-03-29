const express= require('express')
const mongoose = require('mongoose')
const Job = require('../models/job-model')
const geocode = require('../geo-sorting/geocode')
const router = express.Router()


router.post('/users/newjobs/jobs' , async (req,res)=>{      // Route to create a new job via Recruiter
   
    await Job.findOne( { jobType:req.body.jobType , ownerID:req.user.googleID } ) .then(async (currentJob)=>{
        if(currentJob)
             res.redirect('/users/jobs') 
        else {
            
            const coordinates = await geocode(req.user.address)
            console.log(coordinates)
            new Job({
                jd:req.body.jd,
                jobType:req.body.jobType,    
                ownerID:req.user.googleID,
                contact:req.user.contact1,
                ownerName:req.user.username,
                ownerAddress:req.user.address,
                coordinates:coordinates,
                email:req.user.email
             }).save().then( 
                res.redirect('/users/jobs')    
             )
        }
    })
})

router.post('/jobs/delete', async (req,res)=>{            // Route to Delete a job via Recruiter or Admin
    console.log(req.body);
    try{
      await Job.findOneAndDelete( { _id: mongoose.Types.ObjectId(req.body._id) } )
    }
    catch(err){
       console.log(err);
    }
    if(req.user.type == "admin"){
        res.redirect('/users/dashboard')
    }else{
        res.redirect('/users/jobs')
    }
})

router.get('/jobs',async (req,res)=>{
    const jobTypes = req.body.jobTypes
    try {
        const alljobs=await Job.find({})
        let jobs = alljobs
        console.log(jobs)
        if(req.user.type!=='admin')
            jobs = alljobs.filter((job)=> jobTypes.includes(job.jobType))
        res.status(200).send(jobs)
        
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports=router
