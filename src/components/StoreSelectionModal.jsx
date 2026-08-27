import { motion } from 'framer-motion';
import { IoStorefront, IoRestaurant, IoHome, IoGrid } from 'react-icons/io5';
import { useStore } from './StoreContext';

const StoreSelectionModal = () => {
  const { isFirstVisit, selectStore } = useStore();

  if (!isFirstVisit) return null;

  const stores = [
    {
      type: 'SUPERMARKET',
      icon: IoStorefront,
      title: 'Супермаркет',
      description: 'Пакеты, плёнка, контейнеры',
      color: 'from-green-500 to-emerald-600',
    },
    {
      type: 'HOME_STORE',
      icon: IoHome,
      title: 'Хозмаг',
      description: 'Мешки, перчатки, хозтовары',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      type: 'RESTAURANT',
      icon: IoRestaurant,
      title: 'Ресторан',
      description: 'Стаканы, упаковка для еды',
      color: 'from-orange-500 to-red-600',
    },
    {
      type: 'ALL',
      icon: IoGrid,
      title: 'Все товары',
      description: 'Весь каталог без фильтра',
      color: 'from-gray-500 to-gray-700',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-xl my-auto"
      >
        {/* Шапка */}
        <div className="text-center px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
            👋 Добро пожаловать!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Выберите тип вашего бизнеса
          </p>
        </div>

        {/* Список магазинов */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stores.map((store) => (
            <button
              key={store.type}
              onClick={() => selectStore(store.type)}
              className={`bg-gradient-to-r ${store.color} text-white rounded-xl p-4 text-left hover:scale-[1.02] transition-transform shadow-md`}
            >
              <store.icon className="size-6 sm:size-7 mb-2" />
              <h3 className="font-bold text-base sm:text-lg">{store.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{store.description}</p>
            </button>
          ))}
        </div>

        {/* Кнопка пропуска */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={() => selectStore('ALL')}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Показать все товары
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreSelectionModal;