import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';

const Banner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);

  const cases = [
    {
      id: 1,
      title: '🏭 Кафе "Вкусный дом"',
      problem: 'Нужна была упаковка для доставки еды',
      solution: 'Подобрали контейнеры и пакеты с логотипом',
      result: 'Клиент увеличил заказы на 30%',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: '🛍️ Магазин подарков',
      problem: 'Нужна была праздничная упаковка',
      solution: 'Предложили наборы подарочных пакетов',
      result: 'Продажи в праздники выросли в 2 раза',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: '📦 Интернет-магазин',
      problem: 'Дорогая упаковка для отправки',
      solution: 'Оптимизировали размеры и материалы',
      result: 'Экономия 15% на упаковке',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop',
    },
  ];

  const nextCase = () => setCurrentCase((prev) => (prev + 1) % cases.length);
  const prevCase = () => setCurrentCase((prev) => (prev - 1 + cases.length) % cases.length);

  useEffect(() => {
    const timer = setInterval(nextCase, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-3 mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-lg font-bold mb-1">📦 Нужна упаковка под заказ?</h3>
            <p className="text-blue-100 text-sm">Изготовим упаковку любого размера с вашим логотипом</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white text-blue-800 hover:bg-blue-50 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Смотреть кейсы
          </button>
        </div>
      </motion.div>

      {/* Модальное окно с кейсами */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Шапка */}
              <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">🏆 Наши кейсы</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              {/* Карусель */}
              <div className="relative p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={cases[currentCase].image}
                      alt={cases[currentCase].title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='20'%3EКейс%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                      {cases[currentCase].title}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">❓ Задача:</span> {cases[currentCase].problem}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">💡 Решение:</span> {cases[currentCase].solution}
                      </p>
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        ✅ {cases[currentCase].result}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Кнопки навигации */}
                <button
                  onClick={prevCase}
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <IoChevronBack className="size-5" />
                </button>
                <button
                  onClick={nextCase}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <IoChevronForward className="size-5" />
                </button>

                {/* Точки */}
                <div className="flex justify-center gap-2 mt-4">
                  {cases.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentCase(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentCase === i
                          ? 'bg-blue-600 w-6'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                <a
                  href="https://wa.me/79298915289?text=Здравствуйте! Хочу заказать упаковку под заказ"
                  target="_blank"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold transition-colors"
                >
                  📱 Обсудить заказ
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Banner;