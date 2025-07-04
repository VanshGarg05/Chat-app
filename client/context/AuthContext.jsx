import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL

axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [token,setToken] = useState(localStorage.getItem("token"))
    const[authUser,setAuthUser] = useState(null)
    const[onlineUsers,setOnlineUsers] = useState([])
    const[socket,setSocket] = useState(null)


    const checkAuth = async()=>{
        try {
            const {data} = await axios.get('/api/auth/check')
            
            if(data.success){
                
                setAuthUser(data.data)
                connectSocket(data.data)
            }
        } catch (error) {
            
            console.log(error.message);
        }
    }

    const login = async(state, credentials) =>{
        try {
            const { data } = await axios.post(`/api/auth/${state}`,credentials)
            if(data.success){
            
                setAuthUser(data.data.newUser)
                connectSocket(data.data.newUser)
                axios.defaults.headers.common["token"]=data.data.token
                setToken(data.data.token)
                localStorage.setItem("token",data.data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const logout = async()=>{
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null
        toast.success("Logged out successfully")
        socket.disconnect()
    }

    const updateProfile = async(body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile",body)
            if(data.success){
               
                setAuthUser(data.data)
                toast.success("Profile updates successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const connectSocket = (userData)=>{
        if (!userData || socket?.connected) {
            return
        }

        const newSocket = io(backendUrl,{
            query:{
                userId: userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        })
    }


    useEffect(()=>{
        if (token) {
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    },[token])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}