function cartController(){

    return{
        cart(req,res){
            res.render("cart")
        },
       
        update(req,res){
        
            if(!req.session.cart){
                req.session.cart = { items:{},
                totalQty:0,
                totalPrice:0
                
                }
                console.log("i ran");
            }

            let cart = req.session.cart;

            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {item : req.body,qty:1}
                cart.totalQty = cart.totalQty +1;
                let price = parseInt(cart.totalPrice) + parseInt(req.body.price)
                cart.totalPrice = price;
            }else{
                cart.items[req.body._id].qty =   cart.items[req.body._id].qty+1;
                cart.totalQty = cart.totalQty + 1;
                let price = parseInt(cart.totalPrice) + parseInt(req.body.price)
                cart.totalPrice = price;
                
            }
            res.end(JSON.stringify(cart))
         }
        }
    }


module.exports = cartController;