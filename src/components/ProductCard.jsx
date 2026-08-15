import { BiBasket } from 'react-icons/bi';
import { IoAdd, IoRemove } from 'react-icons/io5';

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
  const handleAdd = () => onCountChange(count + 1);
  const handleRemove = () => onCountChange(Math.max(0, count - 1));
  const handleAddToCart = () => onCountChange(1);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Фото */}
      <div className="w-full h-48 bg-gray-100 relative">
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
        {packQuantity && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white font-medium rounded-full text-[10px] shadow-sm">
            📦 {packQuantity} шт/уп
          </span>
        )}
      </div>

      {/* Инфо */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
        )}

        {/* Цена и кнопка */}
                {/* Цена и кнопка */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <span className="text-blue-800 font-bold text-lg">
            {price.toFixed(2)} ₽
            <span className="text-gray-400 text-xs font-normal"> /шт</span>
          </span>

          {count === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 w-full"
            >
              <BiBasket className="size-4" />
              В корзину
            </button>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 rounded-full px-1 py-1 w-full">
              <button
                onClick={handleRemove}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <IoRemove className="size-4 text-blue-800" />
              </button>
              <span className="text-blue-800 font-bold text-base">
                {count}
              </span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <IoAdd className="size-4 text-blue-800" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;