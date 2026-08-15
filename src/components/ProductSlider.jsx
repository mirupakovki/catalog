import { useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, title = 'Популярные товары' }) => {
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;

  const next = () => {
    setStartIndex(prev => Math.min(prev + 1, products.length - itemsPerView));
  };

  const prev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <IoChevronBack className="size-5" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <IoChevronForward className="size-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${startIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product, i) => (
            <div key={i} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerView}%` }}>
              <ProductCard ... />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;