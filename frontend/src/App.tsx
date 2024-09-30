import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css';
import Routing from './components/Routing';

function App() {
  return (
    <div className="App">
      <Router>
        <Routing />
      </Router>
    </div>
  );
}

export default App;
