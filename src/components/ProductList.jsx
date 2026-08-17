import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import { IoAdd, IoRemove, IoArrowUp, IoHeart } from 'react-icons/io5';
import SkeletonCard from './SkeletonCard';
import FavoritesModal from './FavoritesModal';
import { useFavorites } from './FavoritesContext';
import ProductSlider from './ProductSlider';
import { IoIosBasket } from "react-icons/io";

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ39fUa7226CTie68xgiNFwda5spOyZXgijrqODL9NtFYO4R3QRmovxYuHE_JKhgPoi4cMWcI5tl8AA/pub?gid=0&single=true&output=csv';

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";

const ProductList = ({ searchQuery, isFavoritesOpen, setIsFavoritesOpen  }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        const parseCSV = (str) => {
          const result = [];
          let current = '';
          let inQuotes = false;

          for (let char of str) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const lines = csv.split('\n').filter((line) => line.trim());
        if (lines.length < 2) return;

        const headers = parseCSV(lines[0]);
        const data = lines.slice(1).map((line) => {
          const values = parseCSV(line);
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = values[i] || '';
          });
          return obj;
        });

        setProducts(data);
      })
      .catch((err) => console.error('Ошибка загрузки:', err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const updateCart = (productName, count) => {
    setCart((prev) => {
      if (count === 0) {
        const newCart = { ...prev };
        delete newCart[productName];
        return newCart;
      }
      return { ...prev, [productName]: count };
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  const totalItems = Object.values(cart).reduce((sum, c) => sum + c, 0);
  const totalPrice = products.reduce((sum, p) => {
    const qty = cart[p.name] || 0;
    return sum + qty * parseFloat(p.price || 0);
  }, 0);

  const cartItems = products
    .filter((p) => cart[p.name] > 0)
    .map((p) => ({
      ...p,
      price: parseFloat(p.price) || 0,
      quantity: cart[p.name],
      total: (parseFloat(p.price) || 0) * cart[p.name],
    }));

  const categories = [
    'Все',
    ...new Set(products.map((p) => p.category || 'Без категории')),
  ];

  const sortProducts = (list) => {
    switch (sortBy) {
      case 'price-asc':
        return [...list].sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price),
        );
      case 'price-desc':
        return [...list].sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price),
        );
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      case 'name-desc':
        return [...list].sort((a, b) => b.name.localeCompare(a.name, 'ru'));
      default:
        return list;
    }
  };

  const filteredProducts =
    activeCategory === 'Все'
      ? sortProducts(products)
      : sortProducts(
          products.filter(
            (p) => (p.category || 'Без категории') === activeCategory,
          ),
        );

  const searchedProducts = filteredProducts.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedProducts = searchedProducts.reduce((groups, product) => {
    const category = product.category || 'Без категории';
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>

          {/* Слайдер популярных товаров
          {searchedProducts.length > 0 && (
            <ProductSlider
              products={searchedProducts.slice(0, 6)}
              title="🔥 Популярные товары"
              cart={cart}
              updateCart={updateCart}
            />
          )} */}

          {/* Фильтры */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Категория
              </label>
              <select
                id="category-select"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="sort-select"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Сортировка
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer shadow-sm"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="name-asc">Название: А → Я</option>
                <option value="name-desc">Название: Я → А</option>
              </select>
            </div>
          </div>

          {/* Если ничего не найдено */}
          {searchedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Ничего не найдено
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Попробуйте изменить запрос или категорию
              </p>
            </div>
          )}

          {/* Товары */}
          {searchedProducts.length > 0 && activeCategory !== 'Все' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchedProducts.map((product, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    index={i}
                    image={product.image || placeholder}
                    name={product.name || 'Без названия'}
                    description={product.description || ''}
                    price={parseFloat(product.price) || 0}
                    packQuantity={product.packQuantity || ''}
                    category={product.category || ''}
                    count={cart[product.name] || 0}
                    onCountChange={(count) => updateCart(product.name, count)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                    {category}
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">
                      ({items.length} шт.)
                    </span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((product, i) => (
                      <div
                        key={`${category}-${i}`}
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer"
                      >
                        <ProductCard
                          index={i}
                          image={product.image || placeholder}
                          name={product.name || 'Без названия'}
                          description={product.description || ''}
                          price={parseFloat(product.price) || 0}
                          packQuantity={product.packQuantity || ''}
                          category={product.category || ''}
                          count={cart[product.name] || 0}
                          onCountChange={(count) =>
                            updateCart(product.name, count)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Кнопка "Наверх" */}
          {/* Плавающая корзина и кнопка "Наверх" */}
<div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
  {/* Кнопка "Наверх" */}
  {showScrollTop && (
    <button
      onClick={scrollToTop}
      className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <IoArrowUp className="size-5" />
    </button>
  )}

  {/* Корзина */}
  <button
    onClick={() => setIsCartOpen(true)}
    className="relative w-14 h-14 bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
  >
    <IoIosBasket className='size-6'/>
    {totalItems > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {totalItems}
      </span>
    )}
  </button>
</div>

          {/* Модальное окно товара */}
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              cart={cart}
              updateCart={updateCart}
              placeholder={placeholder}
            />
          )}

          {/* Модальное окно избранного */}
          {isFavoritesOpen && (
            <FavoritesModal
              favorites={favorites}
              products={products}
              cart={cart}
              onClose={() => setIsFavoritesOpen(false)}
              updateCart={updateCart}
            />
          )}

          {/* Корзина */}
          {isCartOpen && (
            <CartModal
              cartItems={cartItems}
              totalPrice={totalPrice}
              totalItems={totalItems}
              onClose={() => setIsCartOpen(false)}
              updateCart={updateCart}
              clearCart={clearCart}
            />
          )}
        </>
      )}
    </div>
  );
};

// Модальное окно товара
const ProductModal = ({ product, onClose, cart, updateCart, placeholder }) => {
  if (!product) return null;

  const count = cart[product.name] || 0;

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

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {parseFloat(product.price).toFixed(2)} ₽
              <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">
                {' '}
                /шт
              </span>
            </span>

            {count === 0 ? (
              <button
                onClick={() => updateCart(product.name, 1)}
                className="bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
              >
                <IoIosBasket className='size-6'/>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-gray-700 rounded-full px-3 py-2">
                <button
                  onClick={() =>
                    updateCart(product.name, Math.max(0, count - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500"
                >
                  <IoRemove className="size-4 text-blue-600 dark:text-blue-400" />
                </button>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {count}
                </span>
                <button
                  onClick={() => updateCart(product.name, count + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500"
                >
                  <IoAdd className="size-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;