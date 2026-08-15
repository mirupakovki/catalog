import { useState } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveSearch, setIsActiveSearch] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-5'>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isActiveSearch={isActiveSearch}
        setIsActiveSearch={setIsActiveSearch}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />
      <Main 
        searchQuery={searchQuery} 
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
      />
    </div>
  );
};

export default HomePage;