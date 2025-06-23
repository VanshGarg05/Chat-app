import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/ChatContext';

const Home = () => {
  
  const {selectedUser} = useContext(ChatContext)

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative ${
          selectedUser
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'md:grid-cols-[1fr_2fr]'
        }`}
      >
        {/* Sidebar */}
        <div className="h-full overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Sidebar />
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-full overflow-hidden">
          <ChatContainer />
        </div>

        {/* Right Sidebar */}
        {selectedUser && (
          <div className="h-full overflow-hidden">
            <div className="h-full overflow-y-auto">
              <RightSidebar  />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
