import { IoSearch, IoClose } from 'react-icons/io5';

const Search = ({ isActiveSearch, setIsActiveSearch }) => {
  const handleClickIsActiveSearch = () => {
    setIsActiveSearch(!isActiveSearch);
  };

  return (
    <div className="w-full flex items-center gap-2">
      {/* Инпут поиска */}
      <input
        className={`
          h-12 px-4
          outline-0 border-2 border-black rounded-xl
          text-base
          transition-all duration-300
          ${isActiveSearch 
            ? 'min-w-9/12 opacity-100 visible' 
            : 'w-0 opacity-0 invisible px-0 border-transparent'
          }
        `}
        type="text"
        placeholder={isActiveSearch ? 'Поиск...' : ''}
      />
      
      {/* Кнопка поиска/закрытия */}
      <div
        className="
          w-12 h-12
          flex-shrink-0 flex justify-center items-center 
          bg-black rounded-xl
          cursor-pointer transition-transform hover:scale-110
        "
        onClick={handleClickIsActiveSearch}
      >
        {isActiveSearch ? (
          <IoClose className="size-6 text-white transition-transform rotate-0 hover:rotate-90 duration-300"/> 
        ) : (
          <IoSearch className="size-6 text-white"/>
        )}
      </div>
    </div>
  );
};

export default Search;