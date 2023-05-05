const {startVerification} = require('../utils/verify')
const otpCheck = (req, res, next) => {

    if(!req.user.verified ){
       
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