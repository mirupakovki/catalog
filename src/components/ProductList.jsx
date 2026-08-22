import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import CartModal from './CartModal';
import { IoAdd, IoRemove, IoArrowUp, IoHeart } from 'react-icons/io5';
import SkeletonCard from './SkeletonCard';
import FavoritesModal from './FavoritesModal';
import { useFavorites } from './FavoritesContext';
import ProductModal from './ProductModal';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ39fUa7226CTie68xgiNFwda5spOyZXgijrqODL9NtFYO4R3QRmovxYuHE_JKhgPoi4cMWcI5tl8AA/pub?gid=0&single=true&output=csv';

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";

const ProductList = ({ searchQuery, isFavoritesOpen, setIsFavoritesOpen }) => {
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
            let value = values[i] || '';
            // Исправляем запятую на точку для цены
            if (header === 'price') {
              value = value.replace(',', '.');
            }
            obj[header] = value;
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

  const updateCart = (productName, count, unit = 'шт') => {
    setCart((prev) => {
      if (count === 0) {
        const newCart = { ...prev };
        delete newCart[productName];
        return newCart;
      }
      return {
        ...prev,
        [productName]: {
          count,
          unit,
        },
      };
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  const totalItems = Object.values(cart).reduce((sum, item) => {
    return sum + item.count;
  }, 0);

  const totalPrice = products.reduce((sum, p) => {
    const item = cart[p.name];
    if (!item) return sum;

    const price = parseFloat(p.price) || 0;
    const packQuantity = parseInt(p.packQuantity) || 1;
    const itemPrice = item.unit === 'упак' ? price * packQuantity : price;

    return sum + item.count * itemPrice;
  }, 0);

  const cartItems = products
    .filter((p) => cart[p.name])
    .map((p) => {
      const item = cart[p.name];
      const price = parseFloat(p.price) || 0;
      const packQuantity = parseInt(p.packQuantity) || 1;
      const itemPrice = item.unit === 'упак' ? price * packQuantity : price;

      return {
        ...p,
        price: itemPrice,
        unitPrice: price,
        unit: item.unit,
        packQuantity: packQuantity,
        quantity: item.count,
        total: itemPrice * item.count,
      };
    });

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
                  className="cursor-pointer h-full"
                >
                  <ProductCard
                    index={i}
                    image={product.image || placeholder}
                    name={product.name || 'Без названия'}
                    description={product.description || ''}
                    price={parseFloat(product.price) || 0}
                    packQuantity={product.packQuantity || ''}
                    category={product.category || ''}
                    count={cart[product.name]?.count || 0}
                    onCountChange={(count, unit) =>
                      updateCart(product.name, count, unit)
                    }
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
                        className="cursor-pointer h-full"
                      >
                        <ProductCard
                          index={i}
                          image={product.image || placeholder}
                          name={product.name || 'Без названия'}
                          description={product.description || ''}
                          price={parseFloat(product.price) || 0}
                          packQuantity={product.packQuantity || ''}
                          category={product.category || ''}
                          count={cart[product.name]?.count || 0}
                          onCountChange={(count, unit) =>
                            updateCart(product.name, count, unit)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Плавающая корзина и кнопка "Наверх" */}
          <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <IoArrowUp className="size-5" />
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-14 h-14 bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              🛒
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

export default ProductList;