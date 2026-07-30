import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import hat from "./hat.jpg";

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
        .then(res => res.json())
        .then(data => console.log(data));}, []);

  return (
    <div className="app">
      <div className="header_layout">
        <img src={hat} alt="Chef's Hat" className="hat"></img>
        <h1>Olivia's Cookbook</h1>
        <span className="cookie">🍪</span>
      </div>

      <div>The ultimate cookbook for all of my cooking and baking needs</div>
    
    </div>
  )
}

export default App
