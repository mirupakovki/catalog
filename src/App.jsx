import { ThemeProvider } from './components/ThemeContext';
import { FavoritesProvider } from './components/FavoritesContext';
import { StoreProvider } from './components/StoreContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <StoreProvider>
          <HomePage />
        </StoreProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;