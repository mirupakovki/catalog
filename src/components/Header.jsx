import React, { useState } from 'react';
import Search from './Search';

const Header = () => {
  const [isActiveSearch, setIsActiveSearch] = useState(false);

  return (
    <header className="max-h-11/12 h-20 my-10 flex justify-between items-center">
      {!isActiveSearch && (
        <h2 className="text-2xl font-bold whitespace-nowrap">
          Мир упаковки
        </h2>
      )}
      <div className={isActiveSearch ? 'w-full flex justify-end' : ''}>
        <Search
          isActiveSearch={isActiveSearch}
          setIsActiveSearch={setIsActiveSearch}
        />
      </div>
    </header>
  );
};

export default Header;