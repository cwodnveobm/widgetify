
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

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
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
          <div 
            className="p-4 flex justify-between items-center"
            style={{ backgroundColor, color: textColor }}
          >
            <h3 className="font-medium">{title}</h3>
            <button 
              onClick={onToggle}
              className="p-1 rounded-full hover:bg-black hover:bg-opacity-10"
            >
              <X size={18} color={textColor} />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-4">{message}</p>
            <textarea 
              className="w-full border rounded-md p-2 text-sm mb-2" 
              placeholder="Type your message..."
              rows={3}
            />
            <button
              className="w-full py-2 rounded-md font-medium"
              style={{ backgroundColor, color: textColor }}
            >
              {buttonText}
            </button>
          </div>
          <div className="border-t p-2 text-center text-xs text-gray-500">
            <a 
              href="https://widgetify.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="no-underline text-gray-500"
            >
              Powered by Widgetify
            </a>
          </div>
        </div>
      ) : (
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor, color: textColor }}
          onClick={onToggle}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
