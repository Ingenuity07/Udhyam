const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{                                                    // User email
        type :String,
        trim : true,
        lowercase :true,
    },
    username:{ type:String , trim: true, required: true},      // User name of the user
    address:{ type:String},                                    // Address of the user
    contact1:{ type:String},                                   // main contact of the User
    contact2:{ type:String},                                   // secondary contact of the User                 
    type:{type:String},                                        // User can be Admin, recruiter, or Worker
    jobTypes: [{                                               // Job type array, for Workers who do more than one job
        type:String,
        required:true
    }],
    googleID : { type:String },                                // Google ID for user registered via Google account
    thumbnail : String,                                        // Users Profile Image     
    verified: {type:Boolean, default:false},                   // A flag to check Users is verified or not
    strategy: String,  // Strategy used to register the user (Google Auth or Local Strategy)
    profileComplete:{type:Boolean, default:false},             // A flag to check weather user filled their details or not
    password:String,  // Password of the user when registerd locally
    coordinates:Object
});

userSchema.methods.toJSON = function () {
    const user =this
    const userObj=user.toObject()
    delete userObj.password
    return userObj
}


const User = mongoose.model('user',userSchema);

module.exports = User;