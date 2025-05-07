
import React from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col w-72 h-96">
          <div 
            className="p-4 flex justify-between items-center"
            style={{ backgroundColor, color: textColor }}
          >
            <h3 className="font-medium">{title}</h3>
            <button 
              onClick={onToggle} 
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 p-3 rounded-lg mb-2 inline-block">
              <p className="text-sm">{message}</p>
            </div>
          </div>
          <div className="border-t p-3 bg-gray-50">
            <div className="flex">
              <input
                type="text"
                className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none"
                placeholder="Type a message..."
              />
              <button 
                className="px-4 py-2 rounded-r-md text-sm"
                style={{ backgroundColor, color: textColor }}
              >
                Send
              </button>
            </div>
            <div className="text-xs text-center text-gray-500 mt-2">
              <a 
                href="https://widgetify.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 no-underline"
              >
                Powered by Widgetify
              </a>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={onToggle}
          className="rounded-full shadow-lg p-4 flex items-center justify-center transition-transform hover:scale-105"
          style={{ backgroundColor, color: textColor }}
        >
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
