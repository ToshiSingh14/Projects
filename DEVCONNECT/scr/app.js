const express = require('express');
const cors = require('cors');
const postsRoutes = require("./routes/postsRoutes");



const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hi from the server");

});



app.use("/post", postsRoutes);

module.exports = app;
