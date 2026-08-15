import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { IoAdd, IoRemove } from 'react-icons/io5';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ39fUa7226CTie68xgiNFwda5spOyZXgijrqODL9NtFYO4R3QRmovxYuHE_JKhgPoi4cMWcI5tl8AA/pub?gid=0&single=true&output=csv';

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, []);

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

  const totalItems = Object.values(cart).reduce((sum, c) => sum + c, 0);
  const totalPrice = products.reduce((sum, p) => {
    const qty = cart[p.name] || 0;
    return sum + qty * parseFloat(p.price || 0);
  }, 0);

  // Получаем список категорий
  const categories = ['Все', ...new Set(products.map(p => p.category || 'Без категории'))];

  // Сортировка
  const sortProducts = (list) => {
    switch (sortBy) {
      case 'price-asc':
        return [...list].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-desc':
        return [...list].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      case 'name-desc':
        return [...list].sort((a, b) => b.name.localeCompare(a.name, 'ru'));
      default:
        return list;
    }
  };

  const filteredProducts = activeCategory === 'Все'
    ? sortProducts(products)
    : sortProducts(products.filter(p => (p.category || 'Без категории') === activeCategory));

  // Группируем товары по категориям (для режима "Все")
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const category = product.category || 'Без категории';
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Шапка с корзиной */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Каталог товаров</h1>
        {totalItems > 0 && (
          <div className="bg-blue-800 text-white px-4 py-2 rounded-full text-sm font-medium">
            🛒 {totalItems} шт. — {totalPrice.toFixed(2)} ₽
          </div>
        )}
      </div>

      {/* Фильтры: категория и сортировка */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-500 mb-1">
            Категория
          </label>
          <select
            id="category-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent cursor-pointer shadow-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-500 mb-1">
            Сортировка
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent cursor-pointer shadow-sm"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name-asc">Название: А → Я</option>
            <option value="name-desc">Название: Я → А</option>
          </select>
        </div>
      </div>

      {/* Если выбрана конкретная категория — показываем просто сетку */}
      {activeCategory !== 'Все' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product, i) => (
            <div key={i} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
            <ProductCard
              key={i}
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
        /* Если "Все" — группируем по категориям с заголовками */
        <>
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-800 rounded-full"></span>
                {category}
                <span className="text-gray-400 text-sm font-normal">({items.length} шт.)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((product, i) => (
                    <div 
    key={`${category}-${i}`} 
    onClick={() => setSelectedProduct(product)} 
    className="cursor-pointer"
  >
    <ProductCard
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
            </div>
          ))}
        </>
      )}
      {selectedProduct && (
  <ProductModal
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
    cart={cart}
    updateCart={updateCart}
  />
)}
    </div>
  );
};

export default ProductList;

const ProductModal = ({ product, onClose, cart, updateCart }) => {
  if (!product) return null;

  const count = cart[product.name] || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Фото */}
        <div className="relative">
          <img
            src={product.image || placeholder}
            alt={product.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              if (!e.target.src.includes('data:image')) {
                e.target.src = placeholder;
              }
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-md"
          >
            ✕
          </button>
        </div>

        {/* Инфо */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
          {product.description && (
            <p className="text-gray-500 text-sm mb-4">{product.description}</p>
          )}
          {product.packQuantity && (
            <p className="text-gray-400 text-sm mb-4">📦 В упаковке: {product.packQuantity} шт.</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-800">
              {parseFloat(product.price).toFixed(2)} ₽
              <span className="text-gray-400 text-sm font-normal"> /шт</span>
            </span>

            {count === 0 ? (
              <button
                onClick={() => updateCart(product.name, 1)}
                className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
              >
                В корзину
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-blue-50 rounded-full px-3 py-2">
                <button
                  onClick={() => updateCart(product.name, Math.max(0, count - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-blue-200 hover:bg-blue-100"
                >
                  <IoRemove className="size-4 text-blue-800" />
                </button>
                <span className="text-blue-800 font-bold text-lg">{count}</span>
                <button
                  onClick={() => updateCart(product.name, count + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-blue-200 hover:bg-blue-100"
                >
                  <IoAdd className="size-4 text-blue-800" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};