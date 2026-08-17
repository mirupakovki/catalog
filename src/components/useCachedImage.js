import { useState, useEffect } from 'react';

const useCachedImage = (src, placeholder) => {
  const [cachedSrc, setCachedSrc] = useState(placeholder);
  const [loadedImages, setLoadedImages] = useState(() => {
    // Список уже загруженных фото (не сами фото, а ссылки)
    const saved = localStorage.getItem('loadedImages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!src) return;

    // Если фото уже загружалось — показываем его сразу
    if (loadedImages.includes(src)) {
      setCachedSrc(src);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setCachedSrc(src);
      // Сохраняем ссылку в список загруженных
      const newLoaded = [...loadedImages, src];
      setLoadedImages(newLoaded);
      localStorage.setItem('loadedImages', JSON.stringify(newLoaded));
    };
    img.onerror = () => {
      setCachedSrc(placeholder);
    };
    img.src = src;
  }, [src, placeholder]);

  return cachedSrc;
};

export default useCachedImage;