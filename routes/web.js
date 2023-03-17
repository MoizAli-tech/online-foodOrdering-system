const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");
const ordersController = require("../app/http/controllers/ordersController");
const adminController = require("../app/http/controllers/adminController");

const {auth,admin} = require("../app/http/middlewares/auth");

function initRoutes(app){
   // you donot call the functions of factory function
    app.get("/",homeController().index)
    
    app.get("/logout",auth,authController().logout)

    app.get("/login",authController().login)
    
    app.post("/login",authController().postLogin)
    
    app.get("/register",authController().register)
   
    app.post("/register",authController().postRegister)

    app.get("/cart",cartController().cart)

    app.post("/update-cart",cartController().update)

    app.get("/customer",auth,ordersController().orders)
    
    app.get("/admin",auth,adminController().index);

    app.post("/admin/status",auth,adminController().status);

    app.get("/:id",auth,ordersController().singleOrder)

    app.post("/orders",auth,ordersController().store);



    
}

module.exports = initRoutes;