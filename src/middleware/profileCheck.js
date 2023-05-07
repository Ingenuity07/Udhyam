const profileCheck = (req,res,next)=>{
    if(!req.user.profileComplete)
        res.render('profile-form',{user:req.user})
    else next();
}

module.exports = profileCheck;