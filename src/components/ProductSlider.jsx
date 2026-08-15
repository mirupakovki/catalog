import { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, title = 'Популярные товары', cart, updateCart }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setStartIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoChevronBack className="size-5 text-gray-700 dark:text-white" />
          </button>
          <button
            onClick={next}
            disabled={startIndex >= maxIndex}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoChevronForward className="size-5 text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${startIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 px-2" 
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <ProductCard
                image={product.image}
                name={product.name}
                description={product.description}
                price={parseFloat(product.price) || 0}
                packQuantity={product.packQuantity}
                count={cart[product.name] || 0}
                onCountChange={(count) => updateCart(product.name, count)}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;