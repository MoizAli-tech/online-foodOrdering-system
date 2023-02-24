const PORT = process.env.PORT || 5500;
const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const path = require("path");


//middlewares 
// app.use(expressLayout);
app.use(express.static(path.join(__dirname,"dist")));

  

//view engine 
app.set("views",path.join(__dirname,"./src/views"));
app.set("view engine", "ejs");

//home route
app.get("/",(req,res)=>{
    res.render("home");
})


app.listen(PORT);
