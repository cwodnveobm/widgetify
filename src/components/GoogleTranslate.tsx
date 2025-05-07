
import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface GoogleTranslateProps {
  defaultLanguage: string;
}

const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ defaultLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
  ];
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    // In a real implementation, this would trigger the translation
  };
  
  return (
    <div className="google-translate inline-flex items-center bg-white border rounded-md shadow-sm">
      <div className="px-3 py-2 bg-gray-50 border-r">
        <Globe size={16} className="text-gray-600" />
      </div>
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="px-3 py-2 focus:outline-none text-sm"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoogleTranslate;
