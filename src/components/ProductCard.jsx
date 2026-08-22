import { motion } from 'framer-motion';
import { IoAdd, IoRemove, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useFavorites } from './FavoritesContext';
import { useState } from 'react';

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
  
  const [unit, setUnit] = useState('шт'); // 'шт' или 'упак'
  
  const packPrice = (parseFloat(price) || 0) * (parseInt(packQuantity) || 1);
  
  const currentPrice = unit === 'шт' ? parseFloat(price) || 0 : packPrice;
  const currentLabel = unit === 'шт' ? 'шт' : `упак (${packQuantity} шт)`;

  const formatPrice = (value) => {
  if (value === 0) return '0';
  return value.toFixed(2).replace(/\.?0+$/, '');
};

  const handleAdd = (e) => {
    e.stopPropagation();
    onCountChange(count + 1, unit);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onCountChange(Math.max(0, count - 1), unit);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onCountChange(1, unit);
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
      <div className="p-3 flex flex-col flex-1 pb-16">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight line-clamp-2 min-h-10">
          {name}
        </h3>

        {/* Переключатель: штука / упаковка */}
        {packQuantity && parseInt(packQuantity) > 1 && (
          <div className="mt-2 flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); setUnit('шт'); }}
              className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                unit === 'шт' 
                  ? 'bg-white dark:bg-gray-600 text-blue-800 dark:text-white font-semibold shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Шт
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setUnit('упак'); }}
              className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                unit === 'упак' 
                  ? 'bg-white dark:bg-gray-600 text-blue-800 dark:text-white font-semibold shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Упак
            </button>
          </div>
        )}

        {/* Цена */}
        <div className="mt-auto pt-2">
          <span className="text-blue-800 dark:text-blue-400 font-bold text-lg">
            {formatPrice(currentPrice)} ₽
            <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">
              {' '}/ {unit === 'шт' ? 'шт' : 'упак'}
            </span>
          </span>
          {unit === 'упак' && packQuantity && (
            <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">
              {packQuantity} шт × {formatPrice(parseFloat(price))} ₽
            </p>
          )}
        </div>
      </div>

      {/* Круглая кнопка в правом нижнем углу */}
      <div className="absolute bottom-2 right-2 z-10">
        {count === 0 ? (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCart}
            className="w-8 h-8 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
          >
            <IoAdd className="size-5" />
          </motion.button>
        ) : (
          <div className="flex items-center gap-0.5 bg-blue-800 dark:bg-blue-700 rounded-full px-0.5 py-0.5 shadow-md">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleRemove}
              className="w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <IoRemove className="size-3.5 text-white" />
            </motion.button>
            <span className="text-white font-bold text-xs min-w-4 text-center">
              {count}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleAdd}
              className="w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <IoAdd className="size-3.5 text-white" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;