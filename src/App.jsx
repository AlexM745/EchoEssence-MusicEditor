import React from 'react';
import MusicEditor from './components/MusicEditor';
import Navbar from './components/NavBar';
import './index.css';

const App = () => {
  
  return (
    <div className="relative z-0">
      <div >
        <Navbar />
      </div>
      <div className='pt-10 mt-10 flex justify-center'>
      <MusicEditor />
      </div>
    </div>
  );
};

export default App;
