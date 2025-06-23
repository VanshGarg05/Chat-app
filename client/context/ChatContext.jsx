import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import toast from "react-hot-toast";



export const ChatContext = createContext()


export const ChatProvider = ({children})=>{

    const [messages,setMessages] = useState([])
    const [users,setUsers] = useState([])
    const [selectedUser,setSelectedUser] = useState(null)
    const [unseenMessages,setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext)

    const getUsers = async ()=>{
        try {
            const {data} = await axios.get('/api/messages/users')
            
            if(data.success){
                setUsers(data.data.filteredUsers)
                setUnseenMessages(data.data.unseenMessages)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            console.log(data);
            if(data.success){
                setMessages(data.data || [])
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
           
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.data])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const subscriveToMessage = async () =>{
        if (!socket) {
            return
        }
        socket.on("newMessage",(newMessage)=>{
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages)=>[...prevMessages,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
                }))
            }
        })
    }


    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage")
    }


    useEffect(()=>{
        subscriveToMessage()
        return ()=> unsubscribeFromMessages()
    },[socket,selectedUser])


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages
    }

    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}