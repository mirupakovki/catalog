import { useState, useEffect, useRef } from 'react';
import { IoAdd, IoRemove, IoClose } from 'react-icons/io5';

const CartModal = ({
  cartItems,
  totalPrice,
  totalItems,
  onClose,
  updateCart,
  clearCart,
}) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem('checkoutForm');
    return savedForm
      ? JSON.parse(savedForm)
      : {
          name: '',
          phone: '',
          address: '',
          comment: '',
        };
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Для подсказок адреса
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const addressRef = useRef(null);

  const WHATSAPP_NUMBER = '79298915289';

  const PROMO_CODES = {
    SALE10: 0.1,
    SALE20: 0.2,
    WELCOME: 0.15,
  };

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, discount: PROMO_CODES[code] });
    } else {
      setAppliedPromo(null);
      alert('Промокод недействителен');
    }
  };

  const discountAmount = appliedPromo ? totalPrice * appliedPromo.discount : 0;
  const finalPrice = totalPrice - discountAmount;

  const formatPrice = (value) => {
  if (value === 0) return '0';
  return value.toFixed(2).replace(/\.?0+$/, '');
};

  // Поиск адреса через Яндекс.Карты
  const searchAddress = async (query) => {
  if (query.length < 3) {
    setAddressSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  setIsLoadingAddress(true);
  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token b5cbe250d413b5d6d70a91b42063d6f765b2ea08`, // <-- Вставь свой ключ
      },
      body: JSON.stringify({
        query: query,
        count: 10,
        locations: [
          {
            country: 'Россия',
          }
        ],
      }),
    });

    const data = await response.json();
    
    if (data && data.suggestions && data.suggestions.length > 0) {
      const suggestions = data.suggestions.map(item => {
        const d = item.data;
        
        // Собираем понятный адрес
        const parts = [];
        
        if (d.city) parts.push(`г. ${d.city}`);
        else if (d.settlement) parts.push(d.settlement);
        else if (d.city_district) parts.push(d.city_district);
        
        if (d.street) parts.push(`ул. ${d.street}`);
        if (d.house) parts.push(`д. ${d.house}`);
        if (d.block) parts.push(`корп. ${d.block}`);
        
        const shortAddress = parts.join(', ');
        
        return {
          value: shortAddress || item.value,
          fullAddress: item.value,
          data: {
            city: d.city || d.settlement || '',
            street: d.street || '',
            house: d.house || '',
            region: d.region_with_type || '',
          }
        };
      });
      
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  } catch (error) {
    console.error('Ошибка поиска адреса:', error);
    setAddressSuggestions([]);
    setShowSuggestions(false);
  } finally {
    setIsLoadingAddress(false);
  }
};

  // Обработчик ввода адреса с дебаунсом
  const handleAddressChange = (e) => {
    const value = e.target.value;
    const newFormData = {
      ...formData,
      address: value,
    };
    setFormData(newFormData);
    localStorage.setItem('checkoutForm', JSON.stringify(newFormData));

    clearTimeout(window.addressTimeout);
    window.addressTimeout = setTimeout(() => {
      searchAddress(value);
    }, 300);
  };

  // Выбор адреса из подсказок
  const selectAddress = (suggestion) => {
    const newFormData = {
      ...formData,
      address: suggestion.value,
    };
    setFormData(newFormData);
    localStorage.setItem('checkoutForm', JSON.stringify(newFormData));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Закрыть подсказки при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addressRef.current && !addressRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
    localStorage.setItem('checkoutForm', JSON.stringify(newFormData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalTotal = appliedPromo ? finalPrice : totalPrice;

    const orderText = `
🧾 *НОВЫЙ ЗАКАЗ*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
${formData.address ? `📍 *Адрес:* ${formData.address}` : ''}
${formData.comment ? `💬 *Комментарий:* ${formData.comment}` : ''}
${appliedPromo ? `🎟️ *Промокод:* ${appliedPromo.code} (-${appliedPromo.discount * 100}%)` : ''}

📦 *Товары:*
${cartItems
  .map((item, i) => {
    const unitLabel = item.unit === 'упак' ? 'уп' : 'шт';
    return `${i + 1}. ${item.name}
   ${item.quantity} ${unitLabel} × ${formatPrice(item.price)} ₽ = ${formatPrice(item.total)} ₽`;
  })
  .join('\n')}

💰 *Итого:* ${formatPrice(finalTotal)} ₽
`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setAppliedPromo(null);
    setPromoCode('');

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setIsCheckout(false);
    }, 3000);
  };

  const handleClearForm = () => {
    const clearedForm = {
      name: '',
      phone: '',
      address: '',
      comment: '',
    };
    setFormData(clearedForm);
    localStorage.setItem('checkoutForm', JSON.stringify(clearedForm));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl max-h-[90vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isCheckout ? '📝 Оформление заказа' : '🛒 Корзина'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Заказ отправлен!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Мы свяжемся с вами в WhatsApp.
            </p>
          </div>
        ) : !isCheckout ? (
          <>
            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Корзина пуста
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23ddd' width='64' height='64'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatPrice(item.price)} ₽/
                          {item.unit === 'упак' ? 'уп' : 'шт'}
                        </p>
                        {item.unit === 'упак' && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {item.packQuantity} шт в упаковке
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCart(item.name, item.quantity - 1, item.unit)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500"
                        >
                          <IoRemove className="size-3 text-gray-600 dark:text-white" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center text-gray-800 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCart(item.name, item.quantity + 1, item.unit)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500"
                        >
                          <IoAdd className="size-3 text-gray-600 dark:text-white" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400 w-20 text-right">
                        {formatPrice(item.total)} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Промокод и итог */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-3">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    🎟️ Промокод
                  </label>
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Введите промокод"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-900 text-white rounded-lg text-sm font-medium"
                      >
                        Применить
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">
                        ✅ {appliedPromo.code} (-{appliedPromo.discount * 100}%)
                      </span>
                      <button
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoCode('');
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Убрать
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Итого:
                  </span>
                  {appliedPromo ? (
                    <div className="text-right">
                      <span className="text-sm text-gray-400 line-through mr-2">
                        {formatPrice(totalPrice)} ₽
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(finalPrice)} ₽
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(totalPrice)} ₽
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-5 space-y-4"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClearForm}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                🗑️ Очистить данные
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Ваше имя *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                placeholder="Иван"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                placeholder="+7 (900) 000-00-00"
              />
            </div>

            {/* Адрес с подсказками */}
            <div ref={addressRef} className="relative">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Адрес доставки
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onFocus={() => formData.address && setShowSuggestions(true)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                placeholder="Начните вводить адрес..."
                autoComplete="off"
              />

              {isLoadingAddress && (
                <div className="absolute right-3 top-10">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}

              {showSuggestions && addressSuggestions.length > 0 && (
  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
    {addressSuggestions.map((suggestion, i) => (
      <button
        key={i}
        type="button"
        onClick={() => selectAddress(suggestion)}
        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <p className="text-sm text-gray-800 dark:text-white">
          {suggestion.value}
        </p>
        {suggestion.data.region && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {suggestion.data.region}
          </p>
        )}
      </button>
    ))}
  </div>
)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white resize-none"
                placeholder="Дополнительная информация"
              />
            </div>

            <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Товаров:</span>
                <span>{totalItems} шт.</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Скидка ({appliedPromo.code}):</span>
                  <span>-{formatPrice(discountAmount)} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-blue-600 dark:text-blue-400">
                <span>Итого:</span>
                <span>
                  {appliedPromo
                    ? formatPrice(finalPrice)
                    : formatPrice(totalPrice)}{' '}
                  ₽
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsCheckout(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ← Назад
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                📱 Отправить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartModal;
