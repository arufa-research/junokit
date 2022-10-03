import React from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './components/counter/Counter';
import LogoComponent from './components/logo-comp/LogoComponent';

function App() {
  return (
    <div className="App">
      <Counter/>
      <LogoComponent/>
    </div>
  );
}

export default App;
