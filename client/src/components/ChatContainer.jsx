import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/authcontext';
import { toast } from 'react-hot-toast';

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    sendMessage,
    setSelectedUser,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 h-full">
        <img src={assets.logo_icon} alt="" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime anywhere</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Fixed Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500 sticky top-0 bg-black z-10">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwnMessage = msg?.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isOwnMessage ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isOwnMessage && (
                <img
                  src={selectedUser.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] rounded-lg border border-gray-600"
                />
              ) : (
                <p className="p-3 bg-violet-600/20 text-white text-sm rounded-lg max-w-[200px] break-words">
                  {msg.text}
                </p>
              )}
              <div className="text-xs text-gray-400">
                <p>{formatMessageTime(msg.createdAt)}</p>
                {isOwnMessage && (
                  <img
                    src={authUser.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Sticky Typing Bar */}
      <div className="bg-black/50 backdrop-blur-md px-3 py-3 sticky bottom-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-800 px-3 rounded-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e);
              }}
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 bg-transparent text-white outline-none placeholder-gray-400"
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
            <label htmlFor="image">
              <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" alt="Gallery" />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt="Send"
            className="w-7 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
