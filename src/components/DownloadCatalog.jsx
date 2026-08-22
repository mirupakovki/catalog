const DownloadCatalog = () => {
  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/catalog/catalog.pdf';
    link.download = 'catalog.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      disabled
      onClick={downloadPDF}
      className="flex items-center gap-2 ml-3 border border-gray-300 text-gray-400 text-xs px-4 py-2 rounded-xl font-medium transition-colors cursor-not-allowed"
      title="Каталог скоро будет доступен"
    >
      📥 Скачать каталог
    </button>
  );
};

export default DownloadCatalog;