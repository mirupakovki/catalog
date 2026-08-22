import { useState } from 'react';
import { IoAdd, IoRemove } from 'react-icons/io5';

const ProductModal = ({ product, onClose, cart, updateCart, placeholder }) => {
  const [unit, setUnit] = useState('шт');

  if (!product) return null;

  const cartItem = cart[product.name];
  const count = cartItem?.count || 0;

  const price = parseFloat(product.price) || 0;
  const packQuantity = parseInt(product.packQuantity) || 1;
  const packPrice = price * packQuantity;
  const currentPrice = unit === 'шт' ? price : packPrice;

  const formatPrice = (value) => {
  if (value === 0) return '0';
  return value.toFixed(2).replace(/\.?0+$/, '');
};

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={product.image || placeholder}
            alt={product.name}
            className="w-full h-64 object-contain"
            onError={(e) => {
              if (!e.target.src.includes('data:image')) {
                e.target.src = placeholder;
              }
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-700/90 rounded-full flex items-center justify-center text-gray-600 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-md"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {product.name}
          </h2>
          {product.category && (
            <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mb-3">
              {product.category}
            </span>
          )}
          {product.description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {product.description}
            </p>
          )}
          {product.packQuantity && (
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
              📦 В упаковке: {product.packQuantity} шт.
            </p>
          )}

          {/* Переключатель: штука / упаковка */}
          {packQuantity > 1 && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUnit('шт')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                  unit === 'шт'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Поштучно
              </button>
              <button
                onClick={() => setUnit('упак')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                  unit === 'упак'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Упаковка
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(currentPrice)} ₽
              <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">
                {' '}
                /{unit === 'шт' ? 'шт' : 'упак'}
              </span>
            </span>

            {count === 0 ? (
              <button
                onClick={() => updateCart(product.name, 1, unit)}
                className="bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
              >
                В корзину
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-gray-700 rounded-full px-3 py-2">
                <button
                  onClick={() =>
                    updateCart(product.name, Math.max(0, count - 1), unit)
                  }
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500"
                >
                  <IoRemove className="size-4 text-blue-600 dark:text-blue-400" />
                </button>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {count}
                </span>
                <button
                  onClick={() => updateCart(product.name, count + 1, unit)}
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500"
                >
                  <IoAdd className="size-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            )}
          </div>

          {unit === 'упак' && packQuantity > 1 && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              {packQuantity} шт × {formatPrice(price)} ₽ = {formatPrice(packPrice)} ₽
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;