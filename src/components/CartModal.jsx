import { useState } from 'react';
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

  const WHATSAPP_NUMBER = '79099999999';

  // Промокоды
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
${cartItems.map((item, i) => (
  `${i + 1}. ${item.name}
   ${item.quantity} шт. × ${item.price.toFixed(2)} ₽ = ${item.total.toFixed(2)} ₽`
)).join('\n')}

💰 *Итого:* ${finalTotal.toFixed(2)} ₽
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
                          {item.price.toFixed(2)} ₽/шт
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCart(item.name, item.quantity - 1)
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
                            updateCart(item.name, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500"
                        >
                          <IoAdd className="size-3 text-gray-600 dark:text-white" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-blue-800 dark:text-blue-400 w-20 text-right">
                        {item.total.toFixed(2)} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Промокод и итог */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                {/* Промокод */}
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
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm font-medium"
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

                {/* Итог с учётом скидки */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Итого:
                  </span>
                  {appliedPromo ? (
                    <div className="text-right">
                      <span className="text-sm text-gray-400 line-through mr-2">
                        {totalPrice.toFixed(2)} ₽
                      </span>
                      <span className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                        {finalPrice.toFixed(2)} ₽
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                      {totalPrice.toFixed(2)} ₽
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </>
        ) : (
          /* Форма оформления */
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
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
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
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                placeholder="+7 (900) 000-00-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Адрес доставки
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                placeholder="Город, улица, дом"
              />
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
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white resize-none"
                placeholder="Дополнительная информация"
              />
            </div>

            {/* Сумма заказа */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Товаров:</span>
                <span>{totalItems} шт.</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-green-600 mb-1">
                  <span>Скидка ({appliedPromo.code}):</span>
                  <span>-{discountAmount.toFixed(2)} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-blue-800 dark:text-blue-400">
                <span>Итого:</span>
                <span>
                  {appliedPromo ? finalPrice.toFixed(2) : totalPrice.toFixed(2)} ₽
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