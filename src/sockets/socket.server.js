const { Server } = require("socket.io")
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model")
const {creatMemory, queryMemory} = require("../services/vector.service")

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

          const message =    await messageModel.create({
                chat : messagePayload.chat,
                user : socket.user._id,
                content : messagePayload.content,
                role : "user"


             })

            const vectors = await aiService.generateVector(messagePayload.content)


             const memory = await queryMemory({ // come from pinecone not from mongodb
                queryVector: vectors,
                limit : 3,
                metadata :{
                    user : socket.user._id
                }
            })
            

            await creatMemory({
                vectors,
                messageId : message._id ,
                metadata:{
                    chat:messagePayload.chat,
                    user:socket.user._id,
                    text : messagePayload.content
                }

            })
           
           
            //console.log(memory);
            
            


            const chatHistory = (await messageModel.find({ //stm
                chat: messagePayload.chat
            }).sort({createdAt:-1}).limit(20).lean()).reverse() // give a chat history for a current chat base on chat id 
            

            const stm = chatHistory.map(items=>{
                return {
                    role : items.role,
                    parts :[{text : items.content}]
                }
            })

            const ltm = [
                {
                    role :"user",
                    parts :[{
                        text :`
                           these are previous message from the chat , use them to generate a response 

                           ${memory.map(item=> item.metadata.text).join("\n")

                           }
                        `
                    }]
                }
            ]

            console.log(ltm[0]);
            console.log(stm);
            


            const response = await aiService.generateResponse([...ltm, ...stm]) // push all prevous history with current question to model

        
            
            const reponseMessage =   await messageModel.create({
                chat : messagePayload.chat,
                user : socket.user._id,
                content : response,
                role : "model"


            })




            const responseVector = await aiService.generateVector(response)

            await creatMemory({
                vectors : responseVector,
                messageId : reponseMessage._id,
                metadata :{
                    chat : messagePayload.chat,
                    user : socket.user._id,
                    text : response
                }
            })









            socket.emit('ai-response', {

                content : response,
                chat : messagePayload.chat


            })

            
        })

        
    })
}



module.exports = initSocketServer;