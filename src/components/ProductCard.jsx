import { BiBasket } from 'react-icons/bi';
import { IoAdd, IoRemove, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useFavorites } from './FavoritesContext';

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";

const ProductCard = ({
  image,
  name = 'Без названия',
  description = '',
  price = 0,
  packQuantity = '',
  count = 0,
  onCountChange,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(name);

  const handleAdd = (e) => {
    e.stopPropagation();
    onCountChange(count + 1);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onCountChange(Math.max(0, count - 1));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onCountChange(1);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(name);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Фото */}
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 relative">
        <img
          src={image || placeholder}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (!e.target.src.includes('data:image')) {
              e.target.src = placeholder;
            }
          }}
        />
        
        {/* Кнопка избранного */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 left-2 w-8 h-8 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          {favorite ? (
            <IoHeart className="size-4 text-red-500" />
          ) : (
            <IoHeartOutline className="size-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {packQuantity && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white font-medium rounded-full text-[10px] shadow-sm">
            📦 {packQuantity} шт/уп
          </span>
        )}
      </div>

      {/* Инфо */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}

        {/* Цена и кнопка */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <span className="text-blue-800 dark:text-blue-400 font-bold text-lg">
            {price.toFixed(2)} ₽
            <span className="text-gray-400 dark:text-gray-500 text-xs font-normal"> /шт</span>
          </span>

          {count === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 w-full"
            >
              <BiBasket className="size-4" />
              В корзину
            </button>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-700 rounded-full px-1 py-1 w-full">
              <button
                onClick={handleRemove}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
              >
                <IoRemove className="size-4 text-blue-800 dark:text-blue-400" />
              </button>
              <span className="text-blue-800 dark:text-blue-400 font-bold text-base">
                {count}
              </span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
              >
                <IoAdd className="size-4 text-blue-800 dark:text-blue-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;