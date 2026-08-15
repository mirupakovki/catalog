import ProductList from './ProductList';

const Main = ({ searchQuery, isFavoritesOpen, setIsFavoritesOpen }) => {
  return (
    <main>
      <ProductList 
        searchQuery={searchQuery} 
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
      />
    </main>
  );
};

export default Main;