const profileCheck = (req,res,next)=>{

    console.log(req.user,"profileCheck")

    if(!req.user.profileComplete)
        res.render('profile-form',{user:req.user})
    else next();
}

module.exports = profileCheck;