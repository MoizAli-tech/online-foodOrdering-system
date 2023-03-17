const Order = require("../../models/order");
const moment = require("moment");

function adminController(){
    return{
        async index(req,res){
            try{
                let orders = await Order.find({Status:{$ne:"completed"}}).populate("customerId").sort({createdAt:-1});
                if(req.xhr){
                    return res.json(orders);
                }
                else{
                    return res.render("adminOrders")
                }
            }catch(error){
                next(error)
            }
           
        },
       
        async status(req,res){
            try{
                await Order.updateOne({_id:req.body.orderId},{Status:req.body.status});
                const eventEmitter = req.app.get("eventEmitter");
                eventEmitter.emit("orderUpdated",{id:req.body.orderId,status:req.body.status})
                res.redirect("/admin")
            }catch(error){
                next(error)
            }
        }
    }
}

module.exports = adminController;