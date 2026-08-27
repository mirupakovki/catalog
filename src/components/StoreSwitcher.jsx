import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoStorefront, IoRestaurant, IoHome, IoGrid, IoChevronDown, IoCheckmark } from 'react-icons/io5';
import { useStore } from './StoreContext';

const StoreSwitcher = () => {
  const { storeType, selectStore } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const stores = [
    { type: 'ALL', icon: IoGrid, label: 'Все товары' },
    { type: 'SUPERMARKET', icon: IoStorefront, label: 'Супермаркет' },
    { type: 'HOME_STORE', icon: IoHome, label: 'Хозмаг' },
    { type: 'RESTAURANT', icon: IoRestaurant, label: 'Ресторан' },
  ];

  const currentStore = stores.find(s => s.type === storeType) || stores[0];

  return (
    <div className="relative mr-3">
      {/* Кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <currentStore.icon className="size-4" />
        <span className="hidden sm:inline">{currentStore.label}</span>
        <IoChevronDown className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Выпадающий список */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden z-50"
          >
            {stores.map((store) => (
              <button
                key={store.type}
                onClick={() => {
                  selectStore(store.type);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  storeType === store.type
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-white'
                }`}
              >
                <store.icon className="size-4" />
                <span className="flex-1 text-left">{store.label}</span>
                {storeType === store.type && (
                  <IoCheckmark className="size-4 text-blue-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreSwitcher;