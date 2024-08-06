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
      <div className='m-2 p-2 z-3'>
      <MusicEditor />
      </div>
    </div>
  );
};

export default App;
