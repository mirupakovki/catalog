import { IoSearch, IoClose } from 'react-icons/io5';

const Search = ({ searchQuery, setSearchQuery, isActiveSearch, setIsActiveSearch }) => {
  const handleClickIsActiveSearch = () => {
    if (isActiveSearch) {
      setSearchQuery('');
    }
    setIsActiveSearch(!isActiveSearch);
  };

  return (
    <div className={`flex items-center justify-end ${isActiveSearch ? 'w-full flex-1' : ''}`}>
      <input
        className={
          isActiveSearch
            ? 'h-12 w-full flex-1 px-4 outline-0 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-xl text-base text-gray-700 dark:text-white transition-all duration-300'
            : 'h-12 w-0 px-0 border-0 outline-0 text-base transition-all duration-300 opacity-0 invisible overflow-hidden'
        }
        type="text"
        placeholder={isActiveSearch ? 'Поиск...' : ''}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <button
        className={
          isActiveSearch
            ? 'w-12 h-12 flex-shrink-0 flex justify-center items-center bg-black dark:bg-gray-700 rounded-xl cursor-pointer transition-all ml-2'
            : 'w-12 h-12 flex-shrink-0 flex justify-center items-center bg-black dark:bg-gray-700 rounded-xl cursor-pointer transition-all'
        }
        onClick={handleClickIsActiveSearch}
      >
        {isActiveSearch ? (
          <IoClose className="size-6 text-white transition-transform rotate-0 hover:rotate-90 duration-300"/> 
        ) : (
          <IoSearch className="size-6 text-white"/>
        )}
      </button>
    </div>
  );
};

export default Search;