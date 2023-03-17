const Order = require("../../models/order");
const moment = require("moment")
const mongoose = require("mongoose");
function ordersController() {
    return {

        async orders(req, res) {

            let orders = await Order.find({ customerId: req.user._id });
            res.render("orders", { orders, moment })
        },

        async store(req, res) {
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash("error", "please fill all fields");
                return res.redirect("/cart");
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            try {
                let result = await order.save();
                let placedOrder = await Order.populate(result,{path:"customerId"});
                req.flash("orderSuccess", "order has been placed");
                // delete req.session.cart;
                const eventEmitter = req.app.get("eventEmitter");
                eventEmitter.emit("orderPlaced",placedOrder)
                return res.redirect("/customer")
            }
            catch (error) {
                req.flash("error", "Something went wrong");
                return res.redirect("/cart");
            }

        },

        async singleOrder(req, res, next) {
            try {
                
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return res.status(400).send('Invalid order ID');
                }
                else{
                    const order = await Order.findOne({ _id: req.params.id });

                    return res.render("singleOrder", { order });
                }
               

            } catch (error) {
                next(error)
            }
        },

    }
}

module.exports = ordersController;