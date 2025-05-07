
import React, { useEffect } from 'react';

interface GoogleTranslateProps {
  defaultLanguage: string;
}

const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ defaultLanguage }) => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      // Define the callback function
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: defaultLanguage,
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google-translate-element'
        );
      };
    };
    
    // Create global function
    if (!window.googleTranslateElementInit) {
      addScript();
    }
    
    return () => {
      // Clean up if needed
      delete window.googleTranslateElementInit;
    };
  }, [defaultLanguage]);

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-lg p-4">
      <div id="google-translate-element"></div>
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
  );
};

export default GoogleTranslate;
