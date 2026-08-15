import React from 'react';
import Search from './Search';
import { useTheme } from './ThemeContext';
import { IoMoon, IoSunny } from 'react-icons/io5';

const Header = ({ searchQuery, setSearchQuery, isActiveSearch, setIsActiveSearch }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="max-h-11/12 h-20 mb-5 flex justify-between items-center mx-3 gap-2">
      {!isActiveSearch && (
        <h2 className="text-2xl font-bold whitespace-nowrap dark:text-white">
          Мир упаковки
        </h2>
      )}
      <div className={`flex items-center gap-2 ${isActiveSearch ? 'w-full justify-end' : ''}`}>
        <button
          onClick={toggleTheme}
          className="w-12 h-12 flex-shrink-0 flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer transition-all hover:scale-110"
        >
          {isDark ? (
            <IoSunny className="size-6 text-yellow-400" />
          ) : (
            <IoMoon className="size-6 text-gray-700" />
          )}
        </button>
        
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isActiveSearch={isActiveSearch}
          setIsActiveSearch={setIsActiveSearch}
        />
      </div>
    </header>
  );
};

export default Header;