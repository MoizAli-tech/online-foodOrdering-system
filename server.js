require("dotenv").config();
const PORT = process.env.PORT || 5500;
const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("./app/config/passport.js")(passport);
const mongoose = require("mongoose");
const mongoStore = require("connect-mongo");
const Emitter = require("events");
mongoose.set("strictQuery",true);

//event Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter",eventEmitter);



//db connection
async function dbConnect(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }catch(error){
        console.log("error while connection to db") 
    }
}

dbConnect();
//middlewares 
app.use(expressLayout);
app.use(express.static(path.join(__dirname,"dist")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Sessions
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000 * 60 *60 *24}, // this means cookie will have a maxage of 24 hours
    store:mongoStore.create({
        mongoUrl:process.env.MONGO_URL
    })
}))

//express-flash
app.use(flash())

//passport 
app.use(passport.initialize());
app.use(passport.session());

//view engine 
app.set("views",path.join(__dirname,"./src/views"));
app.set("view engine", "ejs");
//global variables 
app.use((req,res,next)=>{
    res.locals.session =req.session;  
    res.locals.user = req.user;  
    next();
})
//calling all routes
require("./routes/web")(app);



const server = app.listen(PORT);

const io =  require("socket.io")(server);

io.on("connection",(socket)=>{
    socket.on("join",(data)=>{
        console.log(data);
        socket.join(data);
    })
})

eventEmitter.on("orderUpdated",(data)=>{
    
    io.to( `order_${data.id}`).emit("orderUpdated",data);
})


eventEmitter.on("orderPlaced",(data)=>{
    
    io.to( `adminRoom`).emit("orderPlaced",data);
})

app.use((error,req,res,next)=>{
    if(error){
        console.log(error.message,"i am running to show error")
        res.json(`${error.message}`)
    }
})

