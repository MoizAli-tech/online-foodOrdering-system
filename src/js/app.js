const axios = require("axios");
const Noty = require("noty");

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementById("cartCounter");




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
        // next(error)
    }
}

addToCart.forEach((item)=>{
    item.addEventListener("click",(e)=>{
        let pizza = JSON.parse(item.dataset.pizza);
        updateCart(pizza)
    })
})