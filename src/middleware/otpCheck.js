const {startVerification} = require('../utils/verify')
const otpCheck = (req, res, next) => {

    if(!req.user.verified ){
        try{
            console.log('OTP',req.user)
            startVerification(req.user.contact1).then((success)=>console.log('success')).then(()=>res.render('otp',{context: req.user}))
        }
        catch(err){
            res.render('error')}
    } else {
        next();
    }
}
module.exports = otpCheck