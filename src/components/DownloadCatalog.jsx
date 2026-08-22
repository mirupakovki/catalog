const DownloadCatalog = ({ products = [] }) => {
  const openCatalogPage = () => {
    if (products.length === 0) return;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Каталог - Мир упаковки</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 30px; background: #fff; }
            h1 { text-align: center; color: #1e40af; margin-bottom: 5px; }
            .date { text-align: center; color: #666; margin-bottom: 20px; font-size: 14px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .card { border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; }
            .card img { width: 100%; height: 180px; object-fit: contain; display: block; }
            .card-body { padding: 15px; }
            .card h3 { font-size: 16px; margin-bottom: 5px; color: #333; }
            .price { font-size: 18px; font-weight: bold; color: #1e40af; }
            .pack { font-size: 13px; color: #666; margin-top: 3px; }
            .desc { font-size: 12px; color: #888; margin-top: 5px; }
            @media print {
              body { padding: 10px; }
              .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>Мир упаковки</h1>
          <p class="date">Каталог товаров | ${new Date().toLocaleDateString('ru-RU')}</p>
          <div class="grid">
            ${products.map((p, i) => `
              <div class="card">
                ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : ''}
                <div class="card-body">
                  <h3>${i + 1}. ${p.name}</h3>
                  <p class="price">${p.price} ₽/шт</p>
                  ${p.packQuantity ? `<p class="pack">📦 Упаковка: ${p.packQuantity} шт</p>` : ''}
                  ${p.description ? `<p class="desc">${p.description}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1500);
            };
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <button
  onClick={openCatalogPage}
  className="flex items-center gap-2 ml-3 border border-blue-600 hover:bg-blue-700 text-xs px-4 py-2 rounded-xl font-medium transition-colors"
>
  📥 Скачать каталог
</button>
  );
};

export default DownloadCatalog;