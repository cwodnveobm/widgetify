
import React from 'react';

interface ChatWidgetProps {
  title: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  title,
  message,
  buttonText,
  backgroundColor,
  textColor,
  isOpen,
  onToggle
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-72 overflow-hidden">
          <div 
            className="p-3 flex justify-between items-center" 
            style={{ backgroundColor, color: textColor }}
          >
            <div className="font-medium">{title}</div>
            <button 
              onClick={onToggle}
              className="p-1 rounded-full hover:bg-white/20 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-3">{message}</p>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                className="px-3 py-2 rounded-md text-sm"
                style={{ backgroundColor, color: textColor }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={onToggle}
          className="rounded-md py-2 px-4 shadow-md"
          style={{ backgroundColor, color: textColor }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
