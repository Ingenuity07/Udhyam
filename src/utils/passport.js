const passport =require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local').Strategy
const User = require('../models/user-model')

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    }); 
})


passport.use(
    new localStrategy({
        usernameField: 'contact1',
      },async (contact1,password,done)=>{
        
        try{
            console.log(contact1,password)
        
            const user = await User.findOne({contact1})
            console.log(user, "Local starategy")
            if(!user) return done(null,false);
        
            if(user.password !== password) return done (null,false)
            
            return done (null,user)
        }
        catch(err) {
            return done(err,false)
        }
    }))
    
    
passport.use(
    new GoogleStrategy({
        callbackURL :"/auth/google/redirect" ,
        clientID : process.env.clientID ,
        clientSecret: process.env.clientSecret
    }, (accessToken ,refreshToken ,profile ,done )=>{
        
        User.findOne({googleID:profile.id}).then((currentUser)=>{
            if(currentUser){
                console.log('user is already register');
                done(null,currentUser);
            }
            else {
                // console.log(profile);
                new User({
                    username:profile.displayName,
                    googleID: profile.id,
                    thumbnail: profile._json.picture,
                    email : profile._json.email
                }).save().then((newUser)=>{
                    console.log('new user is created ')
                    done(null ,newUser)
                })   
            }
        })     
 })
)