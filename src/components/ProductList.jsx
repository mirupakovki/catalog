import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ39fUa7226CTie68xgiNFwda5spOyZXgijrqODL9NtFYO4R3QRmovxYuHE_JKhgPoi4cMWcI5tl8AA/pub?gid=0&single=true&output=csv';

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext fill='%23888' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18'%3EНет фото%3C/text%3E%3C/svg%3E";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

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

  const [activeCategory, setActiveCategory] = useState('Все');

// Получаем список категорий
const categories = ['Все', ...new Set(products.map(p => p.category || 'Без категории'))];

const filteredProducts = activeCategory === 'Все'
  ? products
  : products.filter(p => (p.category || 'Без категории') === activeCategory);

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

    {/* Кнопки категорий */}
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat
              ? 'bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Сетка товаров */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredProducts.map((product, i) => (
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
      ))}
    </div>
  </div>
);
};

export default ProductList;