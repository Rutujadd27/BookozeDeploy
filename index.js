const express = require("express");
const {connection} = require("./config/db");
const {userRouter} = require("./Router/userRouter");
const {bookRouter} = require("./Router/bookRouter")

const cors = require("cors");
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());


app.get("/home",(req,res)=>{
    res.send(" Welcome to  Bookoz")
})

app.use("/user",userRouter);
app.use("/book",bookRouter);






const port = 8080;
app.listen(port, '0.0.0.0',  async () => {

    try {
                await connection
                console.log("Connected to the database")
            }catch (err){
                console.log(err)
                console.log("Not connected to Database")
        
            }
  console.log(`Server is running on http://localhost:${port}`);
});