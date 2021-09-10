const express = require("express");
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const usersRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/post.js")

dotenv.config();

mongoose.connect(process.env.MONGODB_CONN,() => {
    console.log("db connected")
});

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", usersRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)

app.listen(8000,()=>{
    console.log("server listening : 8000")
})