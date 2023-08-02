const express = require("express");
const {User} = require("./Routes/UserRoute.js");
const { authenticate } = require("./MiddleWares/Authenticate.js");
const { Book } = require("./Routes/BookingRoute.js");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(express.json());
app.use(cors());
app.use("/user",User);
app.use(authenticate);
app.use("/book",Book);


const server =  app.listen(process.env.port,()=>{
    try {
        console.log(`Server is Running on Port ${process.env.port}`);
    } catch (error) {
        console.log({error:error.message});
    }
})

module.exports = {server};