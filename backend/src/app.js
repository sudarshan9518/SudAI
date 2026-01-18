const express = require("express")

const cookieParser = require("cookie-parser")
const app = express();

const cors = require("cors")

//routes
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.route")


module.exports = app;


// middlewares
app.use(cors({
    origin :"http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)






