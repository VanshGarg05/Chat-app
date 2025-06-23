import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/authcontext'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext) 
  const {logout,onlineUsers} = useContext(AuthContext)


  const [msgImages,setMsgImages] = useState([])


  useEffect(()=>{
    setMsgImages(
      messages.filter((msg)=>msg.image).map((msg)=>msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full h-screen overflow-y-auto pb-36 ${selectedUser ? 'max-md:hidden' : ''}`}>


      
      {/* User Info */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* Media Section */}
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div className="cursor-pointer rounded" key={index} onClick={() => window.open(url)}>
              <img src={url} alt="" className='h-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className='flex justify-center py-6 mt-10'>
        <button onClick={()=>logout()} className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar
