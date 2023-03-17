function auth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect("/login");
    }
}

function admin(req,res,next){
    if(req.isAuthenticated() && req.user.role=="admin"){
        next();
    }else{
        return res.redirect("/")
    }
}

module.exports = {auth,admin};