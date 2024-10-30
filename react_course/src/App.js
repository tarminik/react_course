import React from 'react';
import './App.css';
import mockData from './assets/mock-data.json';
import Card from './components/Card';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Card List</h1>
      </header>
      <div className="card-container">
        {mockData.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
