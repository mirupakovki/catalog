import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const STORE_TYPES = {
  ALL: 'Все товары',
  SUPERMARKET: 'Супермаркет',
  HOME_STORE: 'Хозмаг',
  RESTAURANT: 'Ресторан',
};

export const StoreProvider = ({ children }) => {
  const [storeType, setStoreType] = useState(() => {
    const saved = localStorage.getItem('storeType');
    return saved || 'ALL';
  });
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('storeType');
  });

  useEffect(() => {
    localStorage.setItem('storeType', storeType);
  }, [storeType]);

  const selectStore = (type) => {
    setStoreType(type);
    setIsFirstVisit(false);
  };

  const resetStore = () => {
    setStoreType('ALL');
    setIsFirstVisit(true);
  };

  return (
    <StoreContext.Provider value={{ storeType, selectStore, resetStore, isFirstVisit, setIsFirstVisit }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);