import { motion } from 'framer-motion';
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
  index = 0,
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative h-full"
    >
      {/* Фото */}
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
        <motion.img
          src={image || placeholder}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            if (!e.target.src.includes('data:image')) {
              e.target.src = placeholder;
            }
          }}
        />
        
        {/* Кнопка избранного */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 left-2 w-8 h-8 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
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
      <div className="p-4 flex flex-col flex-1 pb-12">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight line-clamp-2 min-h-10">
          {name}
        </h3>

        {/* Цена */}
        <div className="mt-auto pt-2">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
            {price.toFixed(2)} ₽
            <span className="text-gray-400 dark:text-gray-500 text-xs font-normal"> /шт</span>
          </span>
        </div>
      </div>

      {/* Круглая кнопка в правом нижнем углу */}
      <div className="absolute bottom-3 right-3 z-10">
        {count === 0 ? (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCart}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
          >
            <IoAdd className="size-5" />
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 bg-blue-600 dark:bg-blue-700 rounded-full px-1.5 py-1 shadow-md">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleRemove}
              className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <IoRemove className="size-4 text-white" />
            </motion.button>
            <span className="text-white font-bold text-sm min-w-5 text-center">
              {count}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleAdd}
              className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <IoAdd className="size-4 text-white" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;