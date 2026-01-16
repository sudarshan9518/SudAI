const { Server, Socket } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model")

function initSocketServer(httpServer){
    const io = new Server(httpServer, {})

    io.use( async(socket, next)=>{// middleware of socket.io

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")

        if(!cookies.token){
            next(new Error("authentication error :No token provided " ))
        }

        try{
            const decoded =  jwt.verify(cookies.token, process.env.JWTSECRET)

            const user = await userModel.findById(decoded.id)
            socket.user =user
            next()


        }catch(err){
           next(new Error("authentication error :No token provided " ))
            
        }
        


    })
 
    io.on("connection", (socket)=>{
        // console.log("user connected: ", socket.user);
        
        // console.log("new socket connection : ", socket.id);



        socket.on("ai-message", async(messagePayload)=>{ // evnet a
            // console.log(messagePayload);

            /*
            messageplayload = chatid and content
            */

            await messageModel.create({
                chat : messagePayload.chat,
                user : socket.user._id,
                content : messagePayload.content,
                role : "user"


            })

            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({createdAt:-1}).limit(4).lean()).reverse() // give a chat history for a current chat base on chat id 
            



            const response = await aiService.generateResponse(chatHistory.map(items=>{
                return {
                    role : items.role,
                    parts :[{text : items.content}]
                }
            })) // push all prevous history with current question to model

            console.log(response);
            
             await messageModel.create({
                chat : messagePayload.chat,
                user : socket.user._id,
                content : response,
                role : "model"


            })


            socket.emit('ai-response', {

                content : response,
                chat : messagePayload.chat


            })

            
        })

        
    })
}



module.exports = initSocketServer;