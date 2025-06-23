import express, { json } from "express"
import cors from "cors"
import "dotenv/config"
import http from "http"
import connectDB from "./db/index.js"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import  { Server } from "socket.io"


const app = express()
const server = http.createServer(app)

//iniitalize socket.io server

export const io = new Server(server,{
    cors:{origin:"*"}
})


//Store online users

export const userSocketMap = {}

//socket io connection handler

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId
    console.log("User Connectd",userId);

    if (userId) {
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        console.log("User DIsconnected",userId);
        delete userSocketMap[userId] 
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})


app.use(express.json({limit:"4mb"}))
app.use(cors())


app.use('/api/status',(req,res)=>res.send("Server is Live"))

//Routes

app.use('/api/auth',userRouter)
app.use('/api/messages', messageRouter)

await connectDB()


if(process.env.NODE_ENV !== 'production'){

    const PORT = process.env.PORT || 5000;
    server.listen(PORT,()=> console.log("Server is running on Port "+ PORT))
}

export default server