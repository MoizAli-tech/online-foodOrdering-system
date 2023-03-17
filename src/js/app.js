const axios = require("axios");
const Noty = require("noty");
const moment = require("moment");
const initAdmin = require("./admin");

const socket = io();
initAdmin(socket);

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementById("cartCounter");
let orderBtn = document.getElementById("order-btn");
let successAlert = document.getElementById("success-alert");
let customer = window.location.pathname;

order = document.getElementsByClassName("status-box")[0]?.dataset?.order;
order? order = JSON.parse(order): null;


let statusLines = document.querySelectorAll(".status-line");
 
let small = document.createElement("small");




addToCart.forEach((item)=>{
    item.addEventListener("click",(e)=>{
        let pizza = JSON.parse(item.dataset.pizza);
        updateCart(pizza)
    })
})

async function updateCart(pizza){
    try{
       let res =  await axios.post('/update-cart',pizza)
        cartCounter.innerHTML = res.data.totalQty;
      
        new Noty({

            text: "Item has been added",
            type:"success",
            timeout:1000,
            progressBar:false

          }).show();
        
    }catch(error){
        console.log(error);
        new Noty({
            text: "Item was not added",
            type:"error",
            timeout:1000,
            progressBar:false

          }).show();
         next(error)
    }
}




setTimeout(()=>{
    if(successAlert){
        successAlert.remove();
    }
},3000)


function updateOrder(order){
    let i = false;
    statusLines.forEach((line)=>{
            
        if(line.dataset.status == order.Status){
            line.classList.add("current-status");
            small.innerHTML = moment(order.updatedAt).format("hh:mm A");
            line.appendChild(small)
            i=true;
        }else if(line.dataset.status != order.Status && i){
            line.classList.remove("current-status");
            line.classList.remove("step-completed");
            line.classList.add("text-black-500");
            
        }else{
            line.classList.add("step-completed")
            line.classList.replace("current-status","step-completed");
            
        }
    })
   

}

updateOrder(order);


// socket.emit("join","adminRoom");

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')) {
    initAdmin(socket);
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    // data contains id and status of the updated order
    // console.log("i am socket data ", data)
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.Status = data.status
    updateOrder(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})

socket.on('orderPlaced', (order) => {
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'New order!',
        progressBar: false,
    }).show();
    orders.unshift(order)
    orderTableBody.innerHTML = ''
    orderTableBody.innerHTML = generateMarkup(orders)
})

