import { ThemeProvider } from './components/ThemeContext';
import { FavoritesProvider } from './components/FavoritesContext';
import HomePage from './pages/HomePage'; 

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <HomePage />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
export default App;