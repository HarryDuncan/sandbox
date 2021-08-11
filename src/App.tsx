import React from 'react';
import './App.css';
import {AnimationWidget} from './components/animationWidget'

function App() {
  return (
    <div className="App">
      <AnimationWidget scenes={['FractalTree']} />
    </div>
  );
}

export default App;
