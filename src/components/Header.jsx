import React from 'react';
import Search from './Search';
import { useTheme } from './ThemeContext';
import { useFavorites } from './FavoritesContext';
import { IoMoon, IoSunny, IoHeart } from 'react-icons/io5';


const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  isActiveSearch, 
  setIsActiveSearch, 
  onOpenFavorites,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <header className="max-h-11/12 h-20 flex justify-between items-center mx-3 gap-2">
      {!isActiveSearch && (
        <h2 className="text-2xl font-bold whitespace-nowrap dark:text-white">
          Мир упаковки
        </h2>
      )}
      
      <div className={`flex gap-2 ${isActiveSearch ? 'w-full flex-1' : 'flex-1 justify-end'}`}>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isActiveSearch={isActiveSearch}
          setIsActiveSearch={setIsActiveSearch}
        />
        
        {!isActiveSearch && (
          <>
            {/* Кнопка избранного */}
            <button
              onClick={onOpenFavorites}
              className="relative w-12 h-12 flex-shrink-0 flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-xl cursor-pointer transition-all hover:scale-110"
            >
              <IoHeart className="size-6 text-red-500" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Переключатель темы */}
            <button
              onClick={toggleTheme}
              className="w-12 h-12 flex-shrink-0 flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-xl cursor-pointer transition-all hover:scale-110"
            >
              {isDark ? (
                <IoSunny className="size-6 text-yellow-400" />
              ) : (
                <IoMoon className="size-6 text-gray-700" />
              )}
            </button>
          </>
        )}
      </div>
      
    </header>
  );
};

export default Header;