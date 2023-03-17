const menu = require("../../models/menu");

function homeController(){

    return {
        async index(req,res){
            try{
                let pizzas = await menu.find({});
                res.render("home",{pizzas});
            }catch(error){
                next(error)
            }
          
        },

       
    }
}


module.exports = homeController;