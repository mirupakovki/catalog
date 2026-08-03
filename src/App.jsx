import React from 'react';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className='w-full flex justify-center'>
      <HomePage/>
      {/* <Navbar /> */}
    </div>
  );
};

export default App;