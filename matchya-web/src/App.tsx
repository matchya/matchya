import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Header from './components/Header'
import Home from './screens/Home'
import Settings from './screens/Settings';


function App() {

  return (
    <Router>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </Router>
  )
}

export default App
