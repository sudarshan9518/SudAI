const express = require("express")

const cookieParser = require("cookie-parser")
const path = require('path');


const app = express();

const cors = require("cors")

//routes
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.route")





// middlewares
app.use(cors({
    origin :"http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)


app.use(express.static(path.join(__dirname, '../public')));




app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = app;