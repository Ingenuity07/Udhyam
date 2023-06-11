
const User = require('../models/user-model')

const numberCheck = async (req, res, next) => {
    
    // console.log(req.user)
    
    const contact1 =  req.body.contact1
    const user = await User.findOne({contact1 : contact1})
    console.log(user, "num check")
    if(user){
        const message = "This number is already registered, please try with different number"
        if(req.user){
            if(req.user.strategy === "local"){
                next()
                return 
            }
        
            req.user.message= message
            res.render('profile-form',{user:req.user})
        } else {
            res.render('login',{message})
        }
    }
    else
    next();
}
module.exports = numberCheck