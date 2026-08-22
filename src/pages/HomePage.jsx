import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import DownloadCatalog from '../components/DownloadCatalog'; // <-- Импорт
import Banner from '../components/Banner';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ39fUa7226CTie68xgiNFwda5spOyZXgijrqODL9NtFYO4R3QRmovxYuHE_JKhgPoi4cMWcI5tl8AA/pub?gid=0&single=true&output=csv';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveSearch, setIsActiveSearch] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [products, setProducts] = useState([]);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-5">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isActiveSearch={isActiveSearch}
        setIsActiveSearch={setIsActiveSearch}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        products={products} // <-- Передай продукты
      />
      {/* Кнопка скачивания PDF */}
      <DownloadCatalog products={products} />
      <Banner /> {/* <-- Добавь здесь */}
      <Main
        searchQuery={searchQuery}
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
      />
    </div>
  );
};

export default HomePage;
