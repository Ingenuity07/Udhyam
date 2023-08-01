const {startVerification} = require('../utils/verify')
const {isOtpCheck} = require('../../config/featureFlags');
const otpCheck = (req, res, next) => {
    
    if(isOtpCheck && !req.user.verified ){
       
            console.log('OTP',req.user)
            startVerification(req.user.contact1)
            .then((success)=>console.log('success'))
            .then(()=>res.render('otp',{context: req.user}))
            .catch((er)=>{ 
                res.render('error',{message: "Enter valid Phone Number"})})
    } else {
        next();
    }
}



module.exports = otpCheck