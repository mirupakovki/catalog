import ProductList from './ProductList';

const Main = ({ searchQuery }) => {
  return (
    <main>
      <ProductList searchQuery={searchQuery} />
    </main>
  );
};

export default Main;