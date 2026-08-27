import { IoClose, IoHeart } from 'react-icons/io5';
import ProductCard from './ProductCard';

const FavoritesModal = ({ favorites, products, cart, onClose, updateCart }) => {
  const favoriteProducts = products.filter(p => favorites.includes(p.name));

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl max-h-[90vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <IoHeart className="size-6 text-red-500" />
            Избранное
            {favoriteProducts.length > 0 && (
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
                ({favoriteProducts.length} шт.)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Список избранных */}
        <div className="flex-1 overflow-y-auto p-5">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🤍</p>
              <p className="text-gray-500 dark:text-gray-400">В избранном пусто</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Нажмите на сердечко на карточке товара
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteProducts.map((product, i) => {
                // ✅ Исправление: получаем count из объекта
                const cartItem = cart[product.name];
                const count = cartItem?.count || 0;

                return (
                  <ProductCard
                    key={i}
                    image={product.image}
                    name={product.name}
                    description={product.description}
                    price={parseFloat(product.price) || 0}
                    packQuantity={product.packQuantity}
                    count={count}
                    onCountChange={(count, unit) => updateCart(product.name, count, unit)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;