import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.models.js'
import {Message} from '../models/messages.models.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import cloudinary from '../utils/cloudinary.js'
import { io, userSocketMap } from '../index.js'


const getUserForSidebar = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const filteredUsers = await User.find({_id:{$ne: userId}}).select('-password')

    const unseenMessages = {}
    const promises = filteredUsers.map(async(user)=>{
        const messages = await Message.find({senderId: user._id,recieverId:userId, seen:false })
        if (messages.length>0) {
            unseenMessages[user._id] = messages.length
        }
    })
    await Promise.all(promises)
    return res
    .status(200)
    .json(new ApiResponse(200,{filteredUsers,unseenMessages},"Users sent for left Sidebar"))
})


const getMessages = asyncHandler(async(req,res)=>{
     const {id: selectedUserId} = req.params
     const myId = req.user._id

    const messages = await Message.find({
        $or:[
            {senderId:myId,recieverId:selectedUserId},
            {senderId:selectedUserId,recieverId:myId}  
        ]
    })

    await Message.updateMany({senderId: selectedUserId, recieverId: myId},{seen:true})

    return res
    .status(200)
    .json(new ApiResponse(200,messages,"Messages sent Successfully"))


})


const markMessageAsSeen = asyncHandler(async(req,res)=>{
    const {id} = req.params
    await Message.findByIdAndUpdate(id,{seen:true})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Message marked as Seen"))

})


const sendMessage = asyncHandler(async(req,res)=>{
    const {text,image} = req.body
    const recieverId = req.params.id
    const senderId = req.user._id
    
    let imageUrl
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }

    const newMessage = await Message.create({
        senderId,
        recieverId,
        text,
        image:imageUrl
    })

    const recieverSocketId = userSocketMap[recieverId]
    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessage)
    }

    return res
    .status(200)
    .json(new ApiResponse(200,newMessage,"Message Sent Successfully"))
})


export {
    getUserForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage
}