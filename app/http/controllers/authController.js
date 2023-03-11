const User = require("../../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");

function authController() {

    return {
        login(req, res) {
            return res.render("auth/login");
        },
        async postLogin(req, res, next) {
            const { email, password } = req.body;
            
            if(!email || !password ){
                req.flash("error","please fill all fields");
               return  res.redirect("/login");
            }

            passport.authenticate("local", async (error, user, info) => {
                if (error) {
                    req.flash("error", info.message);
                    next(error)
                    return res.redirect("/login")
                }
                if (!user) {
                    req.flash("error", info.message);
                    return res.redirect("/login")
                }

                req.logIn(user, (error) => {
                    if (error) {
                        console.log(error)
                        req.flash("error", info.message);
                        return next(error)
                    }
                    return res.redirect("/")

                })

             


            })(req, res, next)



        },
        register(req, res) {
            res.render("auth/register");
        },
        async postRegister(req, res) {
            const { name, email, password, cpassword } = req.body;
            try {
                // if any of the field is undefined or empty
                if (!name || !email || !password || !cpassword) {
                    req.flash('error', "All field must be filled");
                    return res.redirect("/register")

                    // if password does not match
                } else if (password !== cpassword) {
                    req.flash('error', "Password is not same ");
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect("/register")
                }
                // if email already exists
                let exists = await User.exists({ email })

                if (exists) {
                    req.flash("error", "user already exists with this email");
                    req.flash('name', name);
                    req.flash('email', email)
                    return res.redirect("/register");
                } else {
                    // Adding new user
                    let hash = await bcrypt.hash(password, 10);
                    const user = new User({ name, email, password: hash });
                    console.log(user)
                    let result = await user.save()
                        .catch(() => {
                            req.flash("error", "something went wrong");
                            req.flash('name', name);
                            req.flash('email', email);
                            return res.redirect("/register")
                        });
                    if (result) {
                        return res.redirect("/login");
                    }

                }
            } catch (error) {

            }


        }
    }
}

module.exports = authController;