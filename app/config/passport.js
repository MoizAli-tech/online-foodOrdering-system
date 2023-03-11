const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

function passportInit(passport){
    passport.use(new LocalStrategy({
        usernameField:"email"
    },
    async (email,password,cb)=>{
        try{
          
            const user = await User.findOne({email});
            if(!user){
                return cb(null,false,{message:"no user with such email"})
            }
    
            let result = await bcrypt.compare(password,user.password);
    
            if(!result){
                return cb(null,false,{message:"password is invalid"})
            }else{
                return cb(null,user,{message: "log in success"})
            }
        }catch(error){
            return cb(null,false,{message:"Something went wrong please try again"})
        }
        
    }
    
    ))

    passport.serializeUser((user,cb)=>{
        cb(null,user._id);
    })

    passport.deserializeUser((id,cb)=>{
       
        User.findById(id,(error,user)=>{
            cb(error,user)
        });

    })
}

module.exports = passportInit;