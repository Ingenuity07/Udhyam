const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// 
const jobSchema = new Schema({
    jd:String,                //job description
    jobType:String,           // Type of job
    contact:String,           // Contact of the job provider
    ownerName:String,         // Name of the job provider
    ownerAddress:String,      // Address of the job provider
    ownerID : String,         
    coordinates:Object,       // Coordinates of the job provider
    email:String              // Email of the job provider
});

const Job = mongoose.model('job',jobSchema);

module.exports = Job;

